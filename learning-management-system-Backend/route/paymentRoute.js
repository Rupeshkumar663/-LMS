import express from 'express'
import { RazorpayOrder, verifypayment} from '../controller/orderController.js'

const paymentRouter=express.Router()

paymentRouter.post("/razorpay-order",RazorpayOrder)
paymentRouter.post("/verifypayment",verifypayment)

export default paymentRouter