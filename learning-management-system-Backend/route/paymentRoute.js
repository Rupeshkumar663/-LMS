import express from 'express'
import { RazorpayOrder } from '../controller/orderController'

const paymentRouter=express.Router()

paymentRouter.post("/razorpay-order",RazorpayOrder)
paymentRouter.post("/verifypayment",verifypayment)

export default paymentRouter