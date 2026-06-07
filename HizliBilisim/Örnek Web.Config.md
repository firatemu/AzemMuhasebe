<?xml version="1.0" encoding="utf-8" ?>
<configuration>
    <system.serviceModel>
        <bindings>
            <basicHttpBinding>
              <binding name="BasicHttpBinding_IHizliService" maxBufferPoolSize="2147483647" maxBufferSize="2147483647" maxReceivedMessageSize="2147483647">
                <security mode="Transport">
                  <transport clientCredentialType="None" />
                </security>
              </binding>
            </basicHttpBinding>
        </bindings>
        <client>
            <endpoint address="https://econnecttest.hizliteknoloji.com.tr/Services/HizliService.svc"
                binding="basicHttpBinding" bindingConfiguration="BasicHttpBinding_IHizliService"
                contract="HizliService.IHizliService" name="BasicHttpBinding_IHizliService" />
        </client>
    </system.serviceModel>
</configuration>