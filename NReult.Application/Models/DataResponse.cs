using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net;
using System.Web.Mvc;

namespace NReult.Application.Models
{
    /// <summary>
    /// DataResponse Class has all objects for sending to the view.
    /// </summary>
    /// <remarks>
    /// Generic Object (T) is Class (Model)"/>.
    /// </remarks>
    public class DataResponse<T>
    {
        /// <summary>
        /// Total Pages for return list.
        /// </summary>
        public long TotalPages { get; set; }
        /// <summary>
        /// Total Records of return list.
        /// </summary>
        public long TotalRecords { get; set; }
        /// <summary>
        /// Data List.
        /// </summary>
        public IEnumerable<T> List { get; set; }
        /// <summary>
        /// Data Model.
        /// </summary>
        public T Object { get; set; }
        /// <summary>
        /// Return Message.
        /// </summary>
        public string Message { get; set; }
        /// <summary>
        /// Is Request Success.
        /// </summary>
        public bool Success { get; set; }
        /// <summary>
        /// Return Status Code.
        /// </summary>
        public HttpStatusCode StatusCode { get; set; }
        /// <summary>
        /// Url.
        /// </summary>
        public string Url { get; set; }

        /// <summary>
        /// Static Function for getting result message.
        /// </summary>
        /// <param name="result">Return Result from Request</param>
        /// <returns>
        /// Return JsonResult (DataResponse Object).</returns>
        public static JsonResult CreateMessage(decimal result)
        {
            if (result > 0)
            {
                return new JsonResult
                {
                    Data = new DataResponse<T>
                    {
                        StatusCode = HttpStatusCode.OK,
                        Success = true,
                        Message = "MessageSuccessed"

                    },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                    MaxJsonLength = int.MaxValue
                };
            }
            else
            {
                return new JsonResult
                {
                    Data = new DataResponse<T>
                    {
                        StatusCode = HttpStatusCode.InternalServerError,
                        Success = false,
                        Message = "MessageFaild"

                    },
                    JsonRequestBehavior = JsonRequestBehavior.AllowGet,
                    MaxJsonLength = int.MaxValue
                };
            }
        }
    }
}