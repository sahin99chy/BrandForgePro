import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, CreditCard, Check, Lock, Calendar, Shield, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getTemplateById, unlockTemplate } from "@/lib/template-manager";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface PaymentModalProps {
  templateId: string | null;
  onClose: () => void;
  onSuccess: (templateId: string) => void;
}

export function PaymentModal({ templateId, onClose, onSuccess }: PaymentModalProps) {
  const [paymentType, setPaymentType] = useState<"onetime" | "subscription">("onetime");
  const [subscriptionPlan, setSubscriptionPlan] = useState<"monthly" | "annual">("monthly");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"creditcard" | "paypal">("creditcard");
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    email: ""
  });
  const { toast } = useToast();
  
  if (!templateId) return null;
  
  const template = getTemplateById(templateId);
  if (!template) return null;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateForm = () => {
    if (paymentMethod === "creditcard") {
      if (!formData.cardNumber || formData.cardNumber.length < 15) {
        toast({
          title: "Invalid card number",
          description: "Please enter a valid card number",
          variant: "destructive"
        });
        return false;
      }
      
      if (!formData.cardName) {
        toast({
          title: "Missing name",
          description: "Please enter the name on your card",
          variant: "destructive"
        });
        return false;
      }
      
      if (!formData.expiryDate || !formData.expiryDate.match(/^\d{2}\/\d{2}$/)) {
        toast({
          title: "Invalid expiry date",
          description: "Please enter a valid expiry date (MM/YY)",
          variant: "destructive"
        });
        return false;
      }
      
      if (!formData.cvv || formData.cvv.length < 3) {
        toast({
          title: "Invalid CVV",
          description: "Please enter a valid security code",
          variant: "destructive"
        });
        return false;
      }
    }
    
    if (!formData.email || !formData.email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };
  
  const handlePayment = async () => {
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    try {
      // Calculate amount based on payment type and plan
      let amount = paymentType === "onetime" ? 29 : (subscriptionPlan === "monthly" ? 19 : 199);
      
      // Call the payment API
      const response = await axios.post('/api/verify-payment', {
        templateId,
        paymentMethod,
        amount,
        email: formData.email,
        subscriptionType: paymentType === "subscription" ? subscriptionPlan : null
      });
      
      if (response.data.success) {
        // Unlock the template locally
        unlockTemplate(templateId);
        
        toast({
          title: "Payment successful",
          description: paymentType === "onetime" 
            ? `You've unlocked the ${template.name} template` 
            : "You've subscribed to Brand Forge Pro",
          variant: "default",
        });
        
        onSuccess(templateId);
      } else {
        toast({
          title: "Payment failed",
          description: response.data.message || "There was an error processing your payment",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Dialog open={!!templateId} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl flex items-center gap-2">
            {paymentType === "onetime" ? (
              <>Unlock Premium Template</>
            ) : (
              <>Subscribe to Brand Forge Pro</>
            )}
          </DialogTitle>
          <DialogDescription>
            {paymentType === "onetime" 
              ? `Get access to the ${template.name} template` 
              : "Unlock all premium templates and features"}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="onetime" className="w-full p-6 pt-2">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger 
              value="onetime" 
              onClick={() => setPaymentType("onetime")}
            >
              Single Template
            </TabsTrigger>
            <TabsTrigger 
              value="subscription" 
              onClick={() => setPaymentType("subscription")}
            >
              Subscription
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="onetime" className="mt-0">
            <div className="mb-6 p-4 border rounded-lg bg-slate-50 dark:bg-slate-800">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-md bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <img 
                    src={`/templates/${template.type}/${template.id}.jpg`} 
                    alt={template.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `/templates/placeholder.jpg`;
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-medium">{template.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {template.layout.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Layout
                  </p>
                  <div className="mt-2">
                    <span className="text-lg font-bold">$19.99</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">one-time payment</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="subscription" className="mt-0">
            <RadioGroup 
              defaultValue="monthly" 
              className="mb-6"
              onValueChange={(value) => setSubscriptionPlan(value as "monthly" | "annual")}
            >
              <div className="flex items-start space-x-4 mb-4">
                <RadioGroupItem value="monthly" id="monthly" className="mt-1" />
                <Label htmlFor="monthly" className="flex-1 cursor-pointer">
                  <div className="p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Monthly</span>
                      <span className="text-lg font-bold">$29.99<span className="text-sm font-normal text-slate-500 dark:text-slate-400">/month</span></span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Billed monthly, cancel anytime
                    </p>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-start space-x-4">
                <RadioGroupItem value="annual" id="annual" className="mt-1" />
                <Label htmlFor="annual" className="flex-1 cursor-pointer">
                  <div className="p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 relative overflow-hidden">
                    <div className="absolute -right-8 top-3 bg-green-500 text-white text-xs py-1 px-10 rotate-45">
                      Save 30%
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Annual</span>
                      <span className="text-lg font-bold">$249.99<span className="text-sm font-normal text-slate-500 dark:text-slate-400">/year</span></span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Billed annually, save 30%
                    </p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
            
            <div className="mb-6 space-y-2">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Unlimited template downloads</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Early access to new templates</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Template customization tools</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm">Optional hosting support</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="paypal" className="mt-0">
            <div className="p-4 space-y-4">
              <div 
                className={`flex items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer ${paymentMethod === 'paypal' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-300 dark:border-slate-700'}`}
                onClick={() => setPaymentMethod('paypal')}
              >
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-10 h-10 text-blue-500">
                      <path d="M7.076 21.337H2.47a.97.97 0 0 1-.97-.97V3.878c0-.537.434-.969.97-.969h4.606a.97.97 0 0 1 .97.97v16.49a.97.97 0 0 1-.97.969zm14.666-4.497c0 .328-.106.609-.253.881-.147.273-.345.496-.542.7-.197.203-.433.372-.667.517a3.99 3.99 0 0 1-.707.367c-.2.086-.398.156-.59.2-.19.045-.38.072-.58.072-.227 0-.45-.022-.677-.066a4.29 4.29 0 0 1-.63-.178 3.55 3.55 0 0 1-.57-.283 3.37 3.37 0 0 1-.509-.378 3.415 3.415 0 0 1-.436-.464 3.484 3.484 0 0 1-.343-.539 3.952 3.952 0 0 1-.23-.609 4.946 4.946 0 0 1-.154-.67 6.292 6.292 0 0 1-.073-.706c-.007-.25-.01-.498-.01-.746 0-.152 0-.306.003-.458.003-.153.01-.31.02-.464.01-.154.027-.31.047-.464.02-.153.047-.31.08-.464.033-.153.073-.306.12-.455.047-.15.1-.3.16-.448.06-.147.127-.29.197-.431.07-.14.147-.28.227-.415.08-.134.167-.264.253-.392.087-.127.18-.25.273-.37.093-.12.193-.234.293-.345.1-.11.207-.214.313-.317.107-.102.22-.197.33-.287.113-.089.227-.17.34-.25.113-.078.23-.15.347-.214.117-.064.233-.125.35-.178.117-.053.237-.1.357-.142.12-.044.24-.08.363-.111.123-.03.247-.056.37-.075.123-.019.25-.03.377-.039.127-.008.253-.011.38-.011.26 0 .513.025.763.075.25.05.493.122.726.214.233.092.457.203.67.334.213.13.417.28.607.447.19.167.367.353.527.553.16.2.303.417.43.645.127.228.237.47.327.723.09.253.16.517.213.79.053.273.087.553.1.84.013.286.007.576-.02.863a7.854 7.854 0 0 1-.127.853 6.312 6.312 0 0 1-.237.826 5.143 5.143 0 0 1-.343.773 4.762 4.762 0 0 1-.43.698 5.146 5.146 0 0 1-.507.609c-.18.187-.367.359-.56.517-.193.158-.393.3-.597.428a4.396 4.396 0 0 1-.63.328 4.33 4.33 0 0 1-.653.22 4.165 4.165 0 0 1-.663.111 4.582 4.582 0 0 1-.663.008 3.343 3.343 0 0 1-.643-.097z" fill="currentColor"/>
                    </svg>
                  </div>
                  <p className="text-sm font-medium">Pay with PayPal</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">You'll be redirected to PayPal to complete your purchase</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email"
                  placeholder="your@email.com" 
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isProcessing}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="creditcard" className="mt-0">
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input 
                  id="card-number" 
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456" 
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  disabled={isProcessing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-name">Name on Card</Label>
                <Input 
                  id="card-name" 
                  name="cardName"
                  placeholder="John Doe" 
                  value={formData.cardName}
                  onChange={handleInputChange}
                  disabled={isProcessing}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input 
                    id="expiry" 
                    name="expiryDate"
                    placeholder="MM/YY" 
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    disabled={isProcessing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">Security Code</Label>
                  <Input 
                    id="cvv" 
                    name="cvv"
                    placeholder="123" 
                    value={formData.cvv}
                    onChange={handleInputChange}
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <div className="p-6 pt-2 border-t">
            <Button 
              onClick={handlePayment} 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {paymentType === "onetime" ? (
                    <>Pay $29 and Unlock Template</>
                  ) : (
                    <>Subscribe for {subscriptionPlan === "monthly" ? "$19/month" : "$199/year"}</>
                  )}
                </>
              )}
            </Button>
            
            <p className="text-xs text-center text-slate-500 dark:text-slate-400">
              Your payment is secure and encrypted. By proceeding, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
