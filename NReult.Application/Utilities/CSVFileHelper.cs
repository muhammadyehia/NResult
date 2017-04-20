using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;

namespace NReult.Application.Utilities
{
    public static class CsvFileHelper
    {
        public static List<string> ConvertCsvStreamToSqlInsertStatmentList(Stream inputStream, out long insertStatmentCount)
        {

            var insertStatments = new List<string>();
            using (var stream = new StreamReader(inputStream))
            {
                var firstFileRow = true;
                insertStatmentCount = 0;
                bool firstAppend;
                int index;
                StringBuilder insertStatment;
                InitializeInsertStatment(out index, out insertStatment, out firstAppend);
                var insertStatmentLenth = insertStatment.Length;
                while (!stream.EndOfStream)
                {
                    insertStatmentCount++;
                    var readLine = stream.ReadLine();
                    if (index > 1000)
                    {
                        insertStatments.Add(insertStatment.ToString());
                        InitializeInsertStatment(out index, out insertStatment, out firstAppend);
                    }
                    if (!firstFileRow)
                    { 
                        AppendNewRowToInsertStatment(readLine, firstAppend, ref insertStatment);
                        firstAppend = false;      
                    }
                    else
                    {
                        firstFileRow = false;
                    }
                    index++;
                }
                if (insertStatment.Length > insertStatmentLenth)
                {
                    insertStatments.Add(insertStatment.ToString());
                }
            }
            return insertStatments;
        }

        private static void InitializeInsertStatment(out int index, out StringBuilder insertStatment, out bool firstAppend)
        {
            index = 0;
            insertStatment =
                new StringBuilder(
                    "INSERT INTO [dbo].[Customer] ( [Gender], [Title], [Occupation], [Company], [GivenName], [MiddleInitial], [Surname], [BloodType], [EmailAddress])");
            firstAppend = true;
        }

        public static void AppendNewRowToInsertStatment(string readLine,bool firstAppend,
            ref StringBuilder insertStatment)
        {
            if (string.IsNullOrWhiteSpace(readLine)) return;
            if (!firstAppend)
            {
                insertStatment.Append(" UNION ALL ");
            }
            ReplaceCommaInsideDoubleQoutString(ref readLine);
            // replace sigle qout for sql statment
            readLine = readLine.Replace("'", "’");
            var readLineArray = readLine.Split(',');
            AddNewRow(readLineArray, ref insertStatment);
        }

        public static void AddNewRow(string[] readLineArray, ref StringBuilder insertStatment)
        {
            if (readLineArray.Length != 9) return;
            var insertTemplate =
                $" select N'{readLineArray[0]}',N'{readLineArray[1]}',N'{readLineArray[2]}',N'{readLineArray[3]}',N'{readLineArray[4]}',N'{readLineArray[5]}',N'{readLineArray[6]}',N'{readLineArray[7]}',N'{readLineArray[8]}' ";

            insertStatment.Append(insertTemplate);
        }

        public static void ReplaceCommaInsideDoubleQoutString(ref string readLine)
        {
            var indexOfDoubleQout = readLine.IndexOf("\"", StringComparison.Ordinal);

            if (indexOfDoubleQout <= 0) return;
            var oldStringsList = new List<string>();

            for (int i = 0, j = 0; i < readLine.Length; i++)
            {
                if (readLine[i] == '\"' && j == 0)
                {
                    j = i;
                }
                else if (readLine[i] == '\"' && readLine[i + 1] == ',' && i > j)
                {
                    oldStringsList.Add(readLine.Substring(j, i - j + 1));
                    j = 0;
                }
            }
            foreach (var item in oldStringsList)
            {
                var newString = item.Replace(",", ";");
                readLine = readLine.Replace(item, newString);
            }

        }
    }
}