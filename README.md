#  歐付寶測試

*  參照此說明: https://developers.opay.tw/Prepare/Intro
*  nodejs SDK: https://github.com/o-pay/Payment_Node.js
*  nodejs SDK pdf: https://github.com/o-pay/Payment_Node.js/blob/master/Doc/Nodejs_OPay_Payment_SDK.pdf

## 注意事項
*  ReturnURL 只接受 port 80 的網址，且要是能對外連線的，localhost 會收不到

## 安裝 SDK
將 SDK 中整個 opay_payment_nodejs 資料夾放入 node_modules 路徑裡面  
當開啟專案的時候 require('opay_payment_nodejs')。

## 設定 SDK
*  設定  node_modules/opay_payment_nodejs/conf/payment_conf.xml 檔案
*  OperatingMode: 決定 SDK 中 method 串接時連結的 API URL 位址，僅可設定為 Test 或 Production。
*  MercProfile: 指定要使用的商家 MID 和 Key，名稱對應到同檔案的<MerchantInfo>tag。
*  IsProjectContractor: 指定是否為專案平台商，若設定為 Y 則會將目前設定的 MID 帶入 API 的 PlatformID 參數中，設為 N 則是
帶入空字串。一般請維持設定為 N。
*  MerchantInfo: 設定自訂的 MID 以及對應的 Key，MInfo 的 name 屬性可以自由指定，對應到上方 MercProfile 的設
定值。
*  IgnorePayment: 使用 aio_check_out_credit_all 方法時需要忽略的付款方式。會將讀取到的值以#號連結後帶入
IgnorePayment 參數當中。請將不需要的付款方式註解。


## 使用方法範例
*  最後使用放入參數的付款方法會產生html字串
*  把該字串 render 後即可產生歐付寶的付款網頁
``` js
const opay = require('opay_payment_nodejs')
let create = new opay();
htm = create.payment_client.aio_check_out_credit_onetime(tradeInfo)
```

## io_check_out_XXXX method 基本參數
*  必要欄位
    *  MerchantTradeNo: 交易編號，必須為唯一值，建議使用 20 碼 UID
    *  MerchantTradeDate: 交易日期時間，格式為 yyyy/MM/dd HH:mm:ss
    *  TotalAmount: 交易總金額，須為正整數
    *  TradeDesc: 交易描述
    *  ItemName: 商品名稱，若有多筆，需在金流選擇頁一行一行顯示商品名稱的話，商品名稱請以符號#分隔。
    *  ReturnURL: 當消費者付款完成後，歐付寶會將付款 結果參數以幕後(Server POST)回傳到 該網址。
*  非必要欄位
    *  ChooseSubPayment
    *  OrderResultURL
    *  NeedExtraPaidInfo
    *  ClientBackURL
    *  ItemURL
    *  Remark
    *  HoldTradeAMT
    *  UseRedeem
    *  StoreID
``` js
// example
let tradeInfo = {
    MerchantTradeNo: tradeid,
    MerchantTradeDate: '2020/01/07 17:11:05',
    TotalAmount: '1200',
    TradeDesc: '交易描述123',
    ItemName: 'p1',
    ReturnURL: 'http://localhost',
}
```

## aio_check_out_XXXX method 發票參數

*  RelateNumber: 發票關聯號碼，請用 30 碼 UID
*  CustomerID: 客戶代號
*  CustomerIdentifier: 固定 8 位長度數字
*  CustomerName: 買受人姓名，須為中英文及數字
*  CustomerAddr: 買受人地址
*  CustomerPhone: 買受人電話(純數字)
*  CustomerEmail: 買受人電子郵件
*  ClearanceMark: 經海關出口: 1, 非經海關出口: 2
*  TaxType: 2(零稅率)
*  CarruerType: 載具類別: 無載具: 空字串 會員載具: 1 自然人憑證: 2 手機條碼: 3
*  CarruerNum: 載具內容
*  Donation: 捐贈: 1 不捐贈: 0
*  LoveCode: 受捐贈單位愛心碼
*  Print: 列印: 1 不列印: 0
*  InvoiceItemName: 商品名稱，若有兩項以上商品時請用管線符號”|”分隔。
*  InvoiceItemCount: 商品數量，若有兩項以上商品時請用管線符號”|”分隔。
*  InvoiceItemWord: 商品單位，若有兩項以上商品時請用管線符號”|”分隔。
*  InvoiceItemPrice: 商品價格，若有兩項以上商品時請用管線符號”|”分隔。
*  InvoiceItemTaxType: 商品課稅類別，若有兩項以上商品時請用管線符號”|”分隔。
*  InvoiceRemark: 商品備註，若有兩項以上商品時請用管線符號”|”分隔。
*  DelayDay: 發票開立延遲天數。本參數值請帶 0-15(天)，當天數為 0 時，則付款完成後立即開立發票。
*  InvType: 一般稅額: 07 特種稅額: 08

``` js
// example
let invoiceInfo = {
    RelateNumber: invoiceid,
    CustomerID: null,
    CustomerIdentifier: null,
    CustomerName: null,
    CustomerAddr: null,
    CustomerPhone: null,
    CustomerEmail: null,
    ClearanceMark: '2',
    TaxType: '1',
    CarruerType: '',
    CarruerNum: '',
    Donation: '0',
    LoveCode: null,
    Print: '0',
    InvoiceItemName: 'p1',
    InvoiceItemCount: '1',
    InvoiceItemWord: '個',
    InvoiceItemPrice: '100',
    InvoiceItemTaxType: '1',
    InvoiceRemark: '商品備註',
    DelayDay: '0',
    InvType: '07',
}
```