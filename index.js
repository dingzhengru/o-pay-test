const opay = require('opay_payment_nodejs')
const crypto = require("crypto")

// 信用卡測試卡號: 4311-9522-2222-2222
// 信用卡測試安全碼: 222

// 測試後台: https://vendor-stage.opay.tw/
// 測試帳號: stagetest
// 測試密碼: test1234

// 基本參數
const tradeidBytes = 10  // 長度為 Bytes * 2
const tradeid = crypto.randomBytes(tradeidBytes).toString("hex")


// 發票參數
const invoiceidBytes = 15  // 長度為 Bytes * 2
const invoiceid = crypto.randomBytes(invoiceidBytes).toString("hex")



// *基本參數
// 必要欄位
//     MerchantTradeNo: 交易編號，必須為唯一值，建議使用 20 碼 UID
//     MerchantTradeDate: 交易日期時間，格式為 yyyy/MM/dd HH:mm:ss
//     TotalAmount: 交易總金額，須為正整數
//     TradeDesc: 交易描述
//     ItemName: 商品名稱，若有多筆，需在金流選擇頁 
//               一行一行顯示商品名稱的話，商品名稱請以符號#分隔。
//     ReturnURL: 當消費者付款完成後，歐付寶會將付款 結果參數以幕後(Server POST)回傳到 該網址。

// 非必要欄位
//     ChooseSubPayment:
//     OrderResultURL:
//     NeedExtraPaidInfo:
//     ClientBackURL:
//     ItemURL:
//     Remark:
//     HoldTradeAMT:
//     UseRedeem:
//     StoreID:

// *發票參數
// 必要欄位
//     RelateNumber: 發票關聯號碼，請用 30 碼 UID
//     CustomerID: 
//     CustomerIdentifier: 
//     CustomerName: 
//     CustomerAddr: 
//     CustomerPhone: 
//     CustomerEmail: 
//     ClearanceMark: 
//     TaxType: 2(零稅率)
//     CarruerType: 
//     CarruerNum: 
//     Donation: 
//     LoveCode: 
//     Print: 
//     InvoiceItemName: 
//     InvoiceItemCount: 
//     InvoiceItemWord: 
//     InvoiceItemPrice: 
//     InvoiceItemTaxType: 
//     InvoiceRemark: 
//     DelayDay: 
//     InvType: 

let tradeInfo = {
    MerchantTradeNo: tradeid,
    MerchantTradeDate: '2020/01/07 17:11:05',
    TotalAmount: '1200',
    TradeDesc: '交易描述123',
    ItemName: 'p1',
    ReturnURL: 'http://114.41.117.113:55555',
    // ChooseSubPayment: '',
    // OrderResultURL: '',
    // NeedExtraPaidInfo: '',
    // ClientBackURL: '',
    // ItemURL: '',
    // Remark: '',
    // HoldTradeAMT: '',
    // UseRedeem: '',
    // StoreID: '',
}

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

let create = new opay()

// 回傳 html
// let aio_check_out_credit_onetime = create.payment_client.aio_check_out_credit_onetime(tradeInfo)



const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors()); //允許跨站
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.json()) // for parsing application/json
app.use(express.static('./'))


// app.get('/', function (req, res) {
//     res.send('123')
// })

app.post('/opay', function (req, res) {
    const type = req.body['opay-type']
    console.log(type)

    let tid = crypto.randomBytes(10).toString("hex")
    let nid = crypto.randomBytes(15).toString("hex")

    tradeInfo.MerchantTradeNo = tid
    invoiceInfo.RelateNumber = nid

    let htm = '404'

    if(type == 'aio_check_out_credit_onetime') {
        htm = create.payment_client.aio_check_out_credit_onetime(
                tradeInfo,
                invoiceInfo)
        res.send(htm)
    } else if(type == 'aio_check_out_credit_divide') {
        // 注意: 分期期數及分期總金額請不要直接從 client 端 POST，以免被修改。
        htm = create.payment_client.aio_check_out_credit_divide(
            tradeInfo,
            invoiceInfo,
            12,
            1200)
        res.send(htm)
    } else if(type == 'aio_check_out_cvs') {
        let cvsInfo = {
            'Desc_1': 'Desc_1',
            'Desc_2': 'Desc_2',
            'Desc_3': 'Desc_3',
            'Desc_4': 'Desc_4',
            'PaymentInfoURL': 'http://localhost',
            'StoreExpireDate': '1440',
        }
        htm = create.payment_client.aio_check_out_cvs(
            tradeInfo,
            {},
            cvsInfo)
        res.send(htm)
    } else {
        res.send(htm)
    }
})

app.post('/', function (req, res) {
    console.log('/paid:', req.body)
})

app.post('/opay/paid', function (req, res) {
    console.log('paid:', req.body)
    res.send('paid success')
})

app.get('/opay/paid', function (req, res) {
    res.send('paid success')
})

app.listen(55555, function () {
    console.log('listening on port 55555')
})