using System;
using System.Text;
using FluentAssertions;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using NReult.Application.Utilities;

namespace NResult.Application.Test
{
    [TestClass]
    public class CSVFileHelperTest
    {
        [TestMethod]
  
        public void ReplaceCommaInsideDoubleQoutString_StringhaveTwoDoubleQout_ShouldBeReplaced()
        {
            var inputStatment = ",\"test, , test,test ,test \",";
            var outputStatment = ",\"test; ; test;test ;test \",";
           CsvFileHelper.ReplaceCommaInsideDoubleQoutString(ref inputStatment);
            outputStatment.ShouldBeEquivalentTo(inputStatment);
        }
        [TestMethod]
        public void ReplaceCommaInsideDoubleQoutString_StringhaveMoreThanTwoDoubleQout_ShouldBeReplaced()
        {
            var inputStatment = ",\"test, , test,test ,test \",\" Muhammad , Yehia , Elsayed\",";
            var outputStatment = ",\"test; ; test;test ;test \",\" Muhammad ; Yehia ; Elsayed\",";
            CsvFileHelper.ReplaceCommaInsideDoubleQoutString(ref inputStatment);
            outputStatment.ShouldBeEquivalentTo(inputStatment);
        }
        [TestMethod]
        public void ReplaceCommaInsideDoubleQoutString_StringNothaveDoubleQout_ShouldBeReplaced()
        {
            var inputStatment = ",test, , test,test ,test , Muhammad , Yehia , Elsayed,";
            var outputStatment = ",test, , test,test ,test , Muhammad , Yehia , Elsayed,";
            CsvFileHelper.ReplaceCommaInsideDoubleQoutString(ref inputStatment);
            outputStatment.ShouldBeEquivalentTo(inputStatment);
        }


        [TestMethod]
        public void AppendNewRowToInsertStatment_FirstAppend_ShouldAppentSelectToStatment()
        {
            var inputStatment = "test1,test2,test3,test4,test 5,test 6, Muhammad7 , Yehia8 , Elsayed9";
            var statment=new StringBuilder();
            var outputStatment =
                " select N'test1',N'test2',N'test3',N'test4',N'test 5',N'test 6',N' Muhammad7 ',N' Yehia8 ',N' Elsayed9' ";
            CsvFileHelper.AppendNewRowToInsertStatment(inputStatment, true, ref statment);
            statment.ToString().ShouldBeEquivalentTo(outputStatment);
        }
        [TestMethod]
        public void AppendNewRowToInsertStatment_NotFirstAppend_ShouldAppentSelectToStatment()
        {
            var inputStatment = "test1,test2,test3,test4,test 5,test 6, Muhammad7 , Yehia8 , Elsayed9";
            var oldStatment =
                " select N'test1',N'test2',N'test3',N'test4',N'test 5',N'test 6',N' Muhammad7 ',N' Yehia8 ',N' Elsayed9' ";
            var outPut = oldStatment + " UNION ALL " + oldStatment;
            var statment = new StringBuilder(oldStatment);
            
            CsvFileHelper.AppendNewRowToInsertStatment(inputStatment, false, ref statment);
            statment.ToString().ShouldBeEquivalentTo(outPut);
        }
        [TestMethod]
        public void AppendNewRowToInsertStatment_NotFirstAppendHasSingleQoutCharacter_ShouldAppentSelectToStatment()
        {
            var inputStatment = "test1,tes't2,tes't3,test4,test' 5,test 6, Muhammad7 , Yehia8 , Elsayed9";
            var oldStatment =
                " select N'test1',N'test2',N'test3',N'test4',N'test 5',N'test 6',N' Muhammad7 ',N' Yehia8 ',N' Elsayed9' ";
            var outPut = oldStatment + " UNION ALL " + " select N'test1',N'tes’t2',N'tes’t3',N'test4',N'test’ 5',N'test 6',N' Muhammad7 ',N' Yehia8 ',N' Elsayed9' ";
            var statment = new StringBuilder(oldStatment);

            CsvFileHelper.AppendNewRowToInsertStatment(inputStatment, false, ref statment);
            statment.ToString().ShouldBeEquivalentTo(outPut);
        }
    }
}
