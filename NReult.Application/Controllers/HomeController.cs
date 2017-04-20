using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using NResult.Core.Entities;
using NResult.Core.Interfaces;
using NReult.Application.Utilities;
using NReult.Application.Models;
using System.Net;

namespace NReult.Application.Controllers
{
    public class HomeController : Controller
    {
        private readonly ICustomerService _customerService;

        public HomeController(ICustomerService customerService)
        {
            _customerService = customerService;

        }
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Search(CustomerFilterModel customerFilterModel)
        {
            var result=  _customerService.Qery(customerFilterModel);
            return new JsonResult
            {
                Data = new DataResponse<Customer>
                {
                    List = result,
                    TotalPages = customerFilterModel.TotalPages,
                    TotalRecords = customerFilterModel.TotalRecords,
                    StatusCode = HttpStatusCode.OK,
                    Success = true,
                    Message = "MessageSuccessed"

                },
                JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                MaxJsonLength = int.MaxValue
            };
        }
        [HttpGet]
        public ActionResult Upload()
        {
            ViewBag.Message = "Upload Your Excel File";

            return View();
        }

        [HttpGet]
        public void ClearData()
        {
            _customerService.ClearData();
        }
        [HttpPost]
        public ActionResult Upload(FormCollection formCollection)
        {

            var file = Request?.Files["UploadedFile"];
            if (file == null || (file.ContentLength <= 0) || string.IsNullOrEmpty(file.FileName))
            {
                ViewBag.ErrorMessage = "File is empty";
                return View("Upload");
            }
            if (!file.FileName.Contains(".csv"))
            {
                ViewBag.ErrorMessage = "File is not in correct formate";
                return View("Upload");
            }
            long insertStatmentCount;

            var insertStatments = CsvFileHelper.ConvertCsvStreamToSqlInsertStatmentList(file.InputStream,
                out insertStatmentCount);
            TempData.Add("insertStatmentCount", insertStatmentCount);

            Task.Run(() =>
              Parallel.For(0, insertStatments.Count, x =>
              {
                  _customerService.InsertBulkCustomers(insertStatments[x]);

              })
              );

            return RedirectToAction("Status");
        }




        public ActionResult Status()
        {
            ViewBag.Status = GetPresentageStatus();
            return View();
        }
        [HttpGet]
        public double GetPresentageStatus()
        {
            var count = TempData.Peek("insertStatmentCount");
            if (count != null)
            {
                var customerInFile = (long)count;
                var insertedCostumer = _customerService.GetCustomersCount();
                return Math.Round((insertedCostumer * 100.0 / customerInFile), 2);
            }
            return 0;
        }
    }
}