import React, { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { UserDashboard } from "@/components/user-dashboard";
import { TemplatePreview } from "@/components/template-preview";
import { PaymentModal } from "@/components/payment-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isTemplateUnlocked, unlockTemplate } from "@/lib/template-manager";
import { downloadTemplate } from "@/lib/template-download";
import { useToast } from "@/hooks/use-toast";
import { User, Settings, CreditCard, Download, LogOut } from "lucide-react";

export default function AccountPage() {
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
  const [paymentTemplateId, setPaymentTemplateId] = useState<string | null>(null);
  const { toast } = useToast();

  // Handle template preview
  const handlePreview = (templateId: string) => {
    setPreviewTemplateId(templateId);
  };

  // Handle template download
  const handleDownload = async (templateId: string) => {
    // Check if premium and not unlocked
    if (!isTemplateUnlocked(templateId)) {
      setPaymentTemplateId(templateId);
      return;
    }
    
    // Download template
    toast({
      title: "Download started",
      description: "Your template is being prepared for download...",
    });
    
    try {
      // Create download link
      const isPremium = true; // Premium templates are the only ones that would be in the user dashboard
      const hasAccess = true; // If we're here, the user has access
      
      // Create download link
      const downloadUrl = `/api/download-template?id=${templateId}&premium=${isPremium}&access=${hasAccess}`;
      
      // Create a temporary link element and trigger the download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `${templateId}.zip`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download initiated",
        description: "Your template download has started.",
      });
    } catch (error) {
      console.error("Download failed:", error);
      toast({
        title: "Download failed",
        description: "Failed to download the template. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle payment success
  const handlePaymentSuccess = (templateId: string) => {
    unlockTemplate(templateId);
    setPaymentTemplateId(null);
    
    toast({
      title: "Template unlocked",
      description: "You can now download and use this template.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-300">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 shrink-0">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    My Account
                  </CardTitle>
                  <CardDescription>
                    Manage your account and templates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="templates" className="w-full" orientation="vertical">
                    <TabsList className="flex flex-col items-start h-auto p-0 bg-transparent space-y-1">
                      <TabsTrigger 
                        value="templates" 
                        className="w-full justify-start px-2 data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        My Templates
                      </TabsTrigger>
                      <TabsTrigger 
                        value="profile" 
                        className="w-full justify-start px-2 data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </TabsTrigger>
                      <TabsTrigger 
                        value="billing" 
                        className="w-full justify-start px-2 data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Billing
                      </TabsTrigger>
                      <TabsTrigger 
                        value="settings" 
                        className="w-full justify-start px-2 data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  <div className="mt-6 pt-6 border-t">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div className="flex-1">
              <Tabs defaultValue="templates">
                <TabsContent value="templates" className="m-0">
                  <UserDashboard 
                    onPreview={handlePreview}
                    onDownload={handleDownload}
                  />
                </TabsContent>
                
                <TabsContent value="profile" className="m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile</CardTitle>
                      <CardDescription>
                        Update your personal information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Your Name" defaultValue="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="your@email.com" defaultValue="john@example.com" />
                      </div>
                      <div className="pt-4">
                        <Button>Save Changes</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="billing" className="m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Billing</CardTitle>
                      <CardDescription>
                        Manage your subscription and payment methods
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium">Current Plan</h3>
                              <p className="text-sm text-slate-500 dark:text-slate-400">Free</p>
                            </div>
                            <Button>Upgrade</Button>
                          </div>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                          <h3 className="font-medium mb-2">Payment Methods</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                            No payment methods added yet.
                          </p>
                          <Button variant="outline">Add Payment Method</Button>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                          <h3 className="font-medium mb-2">Billing History</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            No billing history available.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="settings" className="m-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Settings</CardTitle>
                      <CardDescription>
                        Manage your account settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <select 
                          id="language" 
                          className="w-full p-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Email Notifications</Label>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="marketing" className="rounded" />
                          <Label htmlFor="marketing">Marketing emails</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="updates" className="rounded" defaultChecked />
                          <Label htmlFor="updates">Product updates</Label>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <Button>Save Settings</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Template Preview Modal */}
      <TemplatePreview 
        templateId={previewTemplateId}
        onClose={() => setPreviewTemplateId(null)}
        onDownload={handleDownload}
        onUnlock={(templateId) => setPaymentTemplateId(templateId)}
      />
      
      {/* Payment Modal */}
      <PaymentModal 
        templateId={paymentTemplateId}
        onClose={() => setPaymentTemplateId(null)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
