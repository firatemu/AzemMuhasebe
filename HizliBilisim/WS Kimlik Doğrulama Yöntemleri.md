İş Ortağımız ERP'ler Keylerinin bilgisini Web Servis İş Ortağı Tanım Formu(https://portal.hizliteknoloji.com.tr/gerekliler/WebServisİşOrtağıTanımFormu.docx) doldurarak entegrasyon@hizliteknoloji.com.tr adresine mail atarak isteyebilirler.
Mail'de SecretKey ve ApiKey olmak üzere 2 adet key gönderilecektir.

İş Ortağımız ERP'ler için Örnek bir işlemin detayları;

SecretKey = 74c33ff3e0714713a65f9f800d4971ea örnek key
Bu key erp yazılım firması tarafından kod içerisinde kullanılmamalı, bir başkasının eline geçmeyecek şekilde saklanmalıdır.
Firma kullanıcı bilgilerini erp yazılım firması ile paylaştığında yazılım firması onu SecretKey ile https://econnecttest.hizliteknoloji.com.tr/swagger/ui/index#!/RestApi/RestApi_UtilEncrypt metodundan bir defa geçirip dönen kullanıcı adı ve şifreyi saklamalıdır.

Post - https://econnecttest.hizliteknoloji.com.tr/HizliApi/RestApi/UtilEncrypt

{
   "secretKey": "74c33ff3e0714713a65f9f800d4971ea",
   "username": "web servis kullanıcı adı",
   "password": "web servis şifre"
}
response data
{
   "username": "S1q5jNIaexrHMtvzg+ZJWA==",
   "password": "kBOdl86Q4PuynyZzfQKL6w=="
}
                                    
Dönen şifreli data saklanmalı ve bu değerler her login işleminde kullanılmalı.

ApiKey = 9532c6fb449t örnek key
Erp yazılım firması web serviste login olurken Encrypt edilmiş kullanıcı adı ve şifrenin yanında bu parametreyide sabit gönderecektir.

Post - https://econnecttest.hizliteknoloji.com.tr/HizliApi/RestApi/Login
{
   "apiKey": "9532c6fb449t",
   "username": "S1q5jNIaexrHMtvzg+ZJWA==",
   "password": "kBOdl86Q4PuynyZzfQKL6w=="
}  


----------------------------/Services/HizliService.svc için 

1-) Htpp Request Header Mesaj
HizliServiceClient client = new HizliServiceClient();
using (var scope = new OperationContextScope(client.InnerChannel))
{
    var prop = new HttpRequestMessageProperty();
    prop.Headers.Add("Authorization", "Bearer eyJhbGciOiJIUzI1NiIInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjUxNzkiL"); 

    .....
}

2-) Soap Mesaj Header

Token ile
<soapenv:Header>         
         <Authorization>Bearer eyJhbGciOiJIUzI1NiIInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjUxNzkiLCJyb2</Authorization>
</soapenv:Header>


------------------------/HizliApi/RestApi/ Rest servis için 

Login metodu ile token aldıktan sonra örneğin;

HttpWebRequest request = (HttpWebRequest)HttpWebRequest.Create(url);
request.Method = "GET";
request.ContentType = "application/json";
request.Headers.Add("Authorization", "Bearer eyJhbGciOiJIUzI1NiIInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjUxNzkiLCJyb2xlIjpbIjQ2MjA1NTM");
HttpWebResponse response = (HttpWebResponse)request.GetResponse();
StreamReader reader = new StreamReader(response.GetResponseStream());
var str = JsonConvert.DeserializeObject<string>(reader.ReadToEnd());
reader.Close();