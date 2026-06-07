using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace RestApi.Services
{
    public class RestApi
    {
        private string RestApiUrl = "https://econnecttest.hizliteknoloji.com.tr/HizliApi/RestApi";
        public string _PortalKullanici;
        public string _PortalSifre;
        public RestApi(string PortalKullanici,string PortalSifre)
        {
            _PortalKullanici = PortalKullanici;
            _PortalSifre = PortalSifre;
        }
        public  ResponseMessage SendDocument(InputDocument input)
        {
            ResponseMessage responseMessage = new ResponseMessage();
            try
            {
                List<InputDocument> inputDocument = new List<InputDocument>();
                inputDocument.Add(input);

                string url = RestApiUrl + @"/SendDocument";
                HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(url);
                request.Method = "POST";
                request.ContentType = "application/json";
                request.Headers.Add("username", _PortalKullanici);
                request.Headers.Add("password", _PortalSifre);

                string postData = JsonConvert.SerializeObject(inputDocument);
                request.Timeout = 1800000;
                byte[] byteArray = Encoding.UTF8.GetBytes(postData);
                request.ContentLength = byteArray.Length;
                Stream dataStream = request.GetRequestStream();
                dataStream.Write(byteArray, 0, byteArray.Length);
                dataStream.Close();

                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                StreamReader reader = new StreamReader(response.GetResponseStream());
                var output = JsonConvert.DeserializeObject<List<ResponseMessage>>(reader.ReadToEnd());
                reader.Close();
                responseMessage = output[0];
            }
            catch (Exception ex)
            {
                responseMessage.IsSucceeded = false;
                responseMessage.Message = ex.Message;
            }
            return responseMessage;
        }

        public  ResponseMessage SendApplicationResponseXml(InputDocument input)
        {
            ResponseMessage responseMessage = new ResponseMessage();
            try
            {
                string url = RestApiUrl + @"/SendApplicationResponseXml";
                HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(url);
                request.Method = "POST";
                request.ContentType = "application/json";
                request.Headers.Add("username", _PortalKullanici);
                request.Headers.Add("password", _PortalSifre);

                string postData = JsonConvert.SerializeObject(input);
                request.Timeout = 1800000;
                byte[] byteArray = Encoding.UTF8.GetBytes(postData);
                request.ContentLength = byteArray.Length;
                Stream dataStream = request.GetRequestStream();
                dataStream.Write(byteArray, 0, byteArray.Length);
                dataStream.Close();

                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                StreamReader reader = new StreamReader(response.GetResponseStream());
                responseMessage = JsonConvert.DeserializeObject<ResponseMessage>(reader.ReadToEnd());
                reader.Close();
            }
            catch (Exception ex)
            {
                responseMessage.IsSucceeded = false;
                responseMessage.Message = ex.Message;
            }
            return responseMessage;
        }

        public  DocumentList GetDocumentList(int AppType, string DateType, DateTime StartDate, DateTime EndDate, bool IsNew, bool IsExport, Nullable<bool> IsDraft, string TakenFromEntegrator)
        {
            DocumentList doclist = new DocumentList();
            try
            {
                string url = RestApiUrl + @"/GetDocumentList?AppType=" + AppType + "&DateType=" + DateType + "&StartDate=" + String.Format("{0:yyyy-MM-dd HH:mm:ss}", StartDate) + "&EndDate=" + String.Format("{0:yyyy-MM-dd HH:mm:ss}", EndDate) + "&IsNew=" + IsNew + "&IsExport=" + IsExport + "&IsDraft=" + IsDraft + "&TakenFromEntegrator=" + TakenFromEntegrator;
                HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(url);
                request.Method = "GET";
                request.Timeout = 600000;
                request.ContentType = "application/json";
                request.Headers.Add("Username", _PortalKullanici);
                request.Headers.Add("Password", _PortalSifre);

                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                StreamReader reader = new StreamReader(response.GetResponseStream());
                doclist = JsonConvert.DeserializeObject<DocumentList>(reader.ReadToEnd());
                reader.Close();
                return doclist;
            }
            catch (Exception ex)
            {
                doclist.IsSucceeded = false;
                doclist.Message = ex.Message;
                return doclist;
            }
        }

        public  DocumentContent GetDocumentFile(int AppType, string Uuid, string Tur, Nullable<bool> IsDraft, DateTime issuedate)
        {
            DocumentContent doclist = new DocumentContent();
            try
            {
                string url = RestApiUrl + @"/GetDocumentFile?AppType=" + AppType + "&Uuid=" + Uuid + "&Tur=" + Tur + "&IsDraft=" + IsDraft;
                HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(url);
                request.Method = "GET";
                request.Timeout = 600000;
                request.ContentType = "application/json";
                request.Headers.Add("Username", _PortalKullanici);
                request.Headers.Add("Password", _PortalSifre);
                request.Headers.Add("IssueDate", String.Format("{0:yyyy-MM-dd}", issuedate));
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                StreamReader reader = new StreamReader(response.GetResponseStream());
                doclist = JsonConvert.DeserializeObject<DocumentContent>(reader.ReadToEnd());
                reader.Close();
                return doclist;
            }
            catch (Exception ex)
            {
                doclist.IsSucceeded = false;
                doclist.Message = ex.Message;
                return doclist;
            }
        }

        public  GibUserList GetGibUserList(int AppType, string Type, string Identifier)
        {
            GibUserList giblist = new GibUserList();
            try
            {
                string url = RestApiUrl + @"/GetGibUserList?AppType=" + AppType + "&Type=" + Type + "&Identifier=" + Identifier;
                HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(url);
                request.Method = "GET";
                request.Timeout = 600000;
                request.ContentType = "application/json";
                request.Headers.Add("Username", _PortalKullanici);
                request.Headers.Add("Password", _PortalSifre);

                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                StreamReader reader = new StreamReader(response.GetResponseStream());
                giblist = JsonConvert.DeserializeObject<GibUserList>(reader.ReadToEnd());
                reader.Close();
                return giblist;
            }
            catch (Exception ex)
            {
                giblist.IsSucceeded = false;
                giblist.Message = ex.Message;
                return giblist;
            }
        }

        public  DocumentContent GetGibUserFile(int AppType, string Type)
        {
            DocumentContent documentContent = new DocumentContent();
            try
            {
                string url = RestApiUrl + @"/GetGibUserFile?AppType=" + AppType + "&Type=" + Type;
                HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(url);
                request.Method = "GET";
                request.Timeout = 600000;
                request.ContentType = "application/json";
                request.Headers.Add("Username", _PortalKullanici);
                request.Headers.Add("Password", _PortalSifre);

                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                StreamReader reader = new StreamReader(response.GetResponseStream());
                documentContent = JsonConvert.DeserializeObject<DocumentContent>(reader.ReadToEnd());
                reader.Close();
                return documentContent;
            }
            catch (Exception ex)
            {
                documentContent.IsSucceeded = false;
                documentContent.Message = "GetGibUserFile Hata DetayÄ±:" + ex.Message;
            }
            return documentContent;
        }

        public  ResponseMessage SetDocumentFlag(int AppType, string Uuid, string Flag_Name, int Flag_Value)
        {
            ResponseMessage mes = new ResponseMessage();
            try
            {
                string url = RestApiUrl + @"/SetDocumentFlag?AppType=" + AppType + "&Uuid=" + Uuid + "&Flag_Name=" + Flag_Name + "&Flag_Value=" + Flag_Value;
                HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(url);
                request.Method = "GET";
                request.Timeout = 600000;
                request.ContentType = "application/json";
                request.Headers.Add("Username", _PortalKullanici);
                request.Headers.Add("Password", _PortalSifre);
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                StreamReader reader = new StreamReader(response.GetResponseStream());
                mes = JsonConvert.DeserializeObject<ResponseMessage>(reader.ReadToEnd());
                reader.Close();
                return mes;
            }
            catch (Exception ex)
            {
                mes.IsSucceeded = false;
                mes.Message = ex.Message;
                return mes;
            }
        }

        public class InputDocument
        {
            public int AppType { get; set; }
            public string SourceUrn { get; set; }
            public string DestinationIdentifier { get; set; }
            public string DestinationUrn { get; set; }
            public string XmlContent { get; set; }
            public string DocumentUUID { get; set; }
            public string DocumentId { get; set; }
            public string DocumentDate { get; set; }
            public string LocalId { get; set; }
            public bool UpdateDocument { get; set; }
            public bool IsDraft { get; set; }
            public bool IsDraftSend { get; set; }
        }

        public class DocumentList : ResponseMessage
        {
            public List<Document> documents { get; set; }
        }

        public class Document
        {
            public string UUID { get; set; }
            public string EnvelopeUUID { get; set; }
            public int AppType { get; set; }
            public bool IsArchive { get; set; }
            public bool IsRead { get; set; }
            public bool IsAccount { get; set; }
            public bool IsTransferred { get; set; }
            public bool IsPrinted { get; set; }
            public string DocumentId { get; set; }
            public string DocumentTypeCode { get; set; }
            public string ProfileId { get; set; }
            public string DocumentCurrencyCode { get; set; }
            public string TargetTitle { get; set; }
            public string TargetIdentifier { get; set; }
            public string TargetAlias { get; set; }
            public bool IsInternetSale { get; set; }
            public string SendType { get; set; }
            public decimal TaxTotal { get; set; }
            public decimal PayableAmount { get; set; }
            public string LocalReferenceId { get; set; }

            public int Status { get; set; }
            public string StatusExp { get; set; }
            public int EnvelopeStatus { get; set; }
            public string EnvelopeExp { get; set; }
            public string Messsage { get; set; }
            public DateTime IssueDate { get; set; }
            public DateTime CreatedDate { get; set; }
            public Nullable<DateTime> CancelDate { get; set; }
        }

        public class GibUserList : ResponseMessage
        {
            public List<GibUser> gibUserLists { get; set; }
        }

        public class GibUser
        {
            public string Identifier { get; set; }
            public string Alias { get; set; }
            public string Title { get; set; }
            public string Type { get; set; }
            public DateTime FirstCreationTime { get; set; }
            public DateTime AliasCreationTime { get; set; }
        }

        public class DocumentContent : ResponseMessage
        {
            public byte[] DocumentFile { get; set; }
        }

        public class ResponseMessage
        {
            public bool IsSucceeded { get; set; }
            public string Message { get; set; }
        }
    }
}