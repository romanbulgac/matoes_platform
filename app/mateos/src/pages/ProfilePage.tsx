import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Field, FieldLabel, FieldContent } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Shield, CreditCard, Bell, Save } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');

  // Mock state for form
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: '',
  });

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving profile...', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-50/20 to-purple-50/20 p-6">
      <div className="container mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Profile Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account settings and preferences
            </p>
          </div>
          <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white px-4 py-2">
            {user?.role}
          </Badge>
        </div>

        {/* Profile Card */}
        <Card className="border-0 bg-white/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-white text-2xl font-bold">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-muted-foreground">{user?.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">
                    {user?.isEmailVerified ? 'Verified' : 'Not Verified'}
                  </Badge>
                  <Badge variant="secondary">
                    {user?.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
              <Button variant="outline">Change Photo</Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="gap-2">
              <User className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general">
            <Card className="border-0 bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                    <FieldContent>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                    </FieldContent>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                    <FieldContent>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </FieldContent>
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="email">Email Address</FieldLabel>
                  <FieldContent>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                  <FieldContent>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="+40 XXX XXX XXX"
                    />
                  </FieldContent>
                </Field>

                <Separator />

                <div className="flex justify-end gap-3">
                  <Button variant="outline">Cancel</Button>
                  <Button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-primary to-purple-600"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="border-0 bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Field>
                    <FieldLabel htmlFor="currentPassword">Current Password</FieldLabel>
                    <FieldContent>
                      <Input id="currentPassword" type="password" placeholder="••••••••" />
                    </FieldContent>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                    <FieldContent>
                      <Input id="newPassword" type="password" placeholder="••••••••" />
                    </FieldContent>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirmPassword">Confirm New Password</FieldLabel>
                    <FieldContent>
                      <Input id="confirmPassword" type="password" placeholder="••••••••" />
                    </FieldContent>
                  </Field>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
                    <div>
                      <p className="font-medium">Enable 2FA</p>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security
                      </p>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end gap-3">
                  <Button variant="outline">Cancel</Button>
                  <Button className="bg-gradient-to-r from-primary to-purple-600">
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <Card className="border-0 bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Billing & Subscriptions</CardTitle>
                <CardDescription>
                  Manage your payment methods and subscriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No active subscriptions</p>
                  <Button className="mt-4 bg-gradient-to-r from-primary to-purple-600">
                    Browse Plans
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="border-0 bg-white/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose what notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    title: 'Email Notifications',
                    description: 'Receive email updates about your account',
                  },
                  {
                    title: 'Consultation Reminders',
                    description: 'Get reminded before scheduled consultations',
                  },
                  {
                    title: 'Progress Reports',
                    description: 'Receive weekly progress reports',
                  },
                  {
                    title: 'Marketing Emails',
                    description: 'Stay updated with new features and offers',
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

