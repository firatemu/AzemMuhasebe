Test için;

             SecretKey: 9785bcc3953673cfb92246398b25449ad25e
             ApiKey: 9785bcc39536
             https://econnecttest.hizliteknoloji.com.tr/swagger/ui/index

             Test işlemleri için aşağıdaki bilgiler kullanılabilir.

             Kullanıcı Adı: hizlitest
             Şifre: Test.1234

             URL:
             portaltest.hizliteknoloji.com.tr

             Detaylı Entegrasyon Dokümanı:
             https://econnecttest.hizliteknoloji.com.tr/IntegrationDocuments

             İş Ortağımız ERP'ler için Örnek bir işlemin detayları;

             SecretKey = "9785bcc3953673cfb92246398b25449ad25e" örnek key
             Bu key erp yazılım firması tarafından kod içerisinde kullanılmamalı, bir başkasının eline geçmeyecek şekilde saklanmalıdır.
             Firma kullanıcı bilgilerini erp yazılım firması ile paylaştığında yazılım firması onu SecretKey ile
             https://econnecttest.hizliteknoloji.com.tr/swagger/ui/index#!/RestApi/RestApi_UtilEncrypt
             metodundan bir defa geçirip dönen kullanıcı adı ve şifreyi saklamalıdır.

             Post - https://econnecttest.hizliteknoloji.com.tr/HizliApi/RestApi/UtilEncrypt
             {
                "secretKey": "9785bcc3953673cfb92246398b25449ad25e",
                "username": "hizlitest",
                "password": "Test.1234"
             }
             response data
             {
                "username": "S1q5jNIaexrHMtvzg+ZJWA==",
                "password": "kBOdl86Q4PuynyZzfQKL6w=="
             }
             
             Dönen şifreli data saklanmalı ve bu değerler her login işleminde kullanılmalı.

             ApiKey = "9785bcc39536" örnek key
             Erp yazılım firması web serviste login olurken Encrypt edilmiş kullanıcı adı ve şifrenin yanında bu parametreyide sabit gönderecektir.

             Post - https://econnecttest.hizliteknoloji.com.tr/HizliApi/RestApi/Login
             {
                "apiKey": "9785bcc39536",
                "username": "S1q5jNIaexrHMtvzg+ZJWA==",
                "password": "kBOdl86Q4PuynyZzfQKL6w=="
             }  

             Açıklamalar:
             Güncelleme sonrası Login'den token alınıp Authorization Bearer doğrulama yöntemi (JWT) zorunlu hale gelecektir.
             Request Headerda her metod için kullanıcı adı ve şifre gönderilmeyecektir.
             Token süresi 3 (üç) gündür, bilginize.