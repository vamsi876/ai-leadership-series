import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const initialInfo = {
  full_name: '',
  email: '',
  role: '',
  organization: '',
  bio: '',
};

const Profile = () => {
  const [info, setInfo] = useState(initialInfo);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch user info on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setError('Not logged in.');
        setLoading(false);
        return;
      }
      const email = user.email;
      let name = user.user_metadata?.name || '';
      if (!email) {
        setError('No email found for user.');
        setLoading(false);
        return;
      }
      // Try to fetch from users_personal_information
      const { data, error: fetchError } = await supabase
        .from('users_personal_information')
        .select('*')
        .eq('email', email)
        .single();
      if (fetchError && fetchError.code !== 'PGRST116') {
        setError('Failed to fetch user info.');
        setLoading(false);
        return;
      }
      if (!data) {
        // Insert new record if not found
        const { error: insertError } = await supabase
          .from('users_personal_information')
          .insert([{ email, full_name: name }]);
        if (insertError) {
          setError('Failed to create user info.');
          setLoading(false);
          return;
        }
        setInfo({ ...initialInfo, email, full_name: name });
      } else {
        setInfo({
          full_name: data.full_name || '',
          email: data.email || '',
          role: data.role || '',
          organization: data.organization || '',
          bio: data.bio || '',
        });
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInfo({ ...info, [e.target.id]: e.target.value });
  };

  const validate = () => {
    if (!info.full_name.trim()) return 'Full name is required.';
    if (!info.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(info.email)) return 'Valid email is required.';
    return null;
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setSaving(false);
      return;
    }
    // Upsert user info
    const { error: upsertError } = await supabase
      .from('users_personal_information')
      .upsert({
        email: info.email,
        full_name: info.full_name,
        role: info.role,
        organization: info.organization,
        bio: info.bio,
      }, { onConflict: 'email' });
    setSaving(false);
    if (upsertError) {
      setError('Failed to save info.');
    } else {
    toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
    });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (loading) {
    return <AppLayout><div className="max-w-4xl mx-auto p-8">Loading...</div></AppLayout>;
  }
  
  return (
    <AppLayout>
      <div className="animate-fade-in max-w-4xl mx-auto relative">
        <button
          onClick={handleLogout}
          className="absolute right-0 top-0 mt-2 mr-2 px-4 py-2 bg-green-900 text-white rounded hover:bg-green-800 transition"
        >
          Logout
        </button>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>
        <Tabs defaultValue="general" className="mb-8">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-2xl bg-ai-blue text-white">
                      {info.full_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input id="full_name" value={info.full_name} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" value={info.role} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization</Label>
                    <Input id="organization" value={info.organization} onChange={handleChange} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" rows={4} placeholder="Tell us about yourself..." value={info.bio} onChange={handleChange} />
                  </div>
                </div>
                {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
              </CardContent>
              <CardFooter className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => window.location.reload()}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="preferences" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Preferences</CardTitle>
                <CardDescription>Customize your learning experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Updates</h3>
                      <p className="text-sm text-muted-foreground">Receive regular updates on your learning progress</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="email-updates" className="form-checkbox h-5 w-5" defaultChecked />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Course Recommendations</h3>
                      <p className="text-sm text-muted-foreground">Get recommendations based on your learning history</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="recommendations" className="form-checkbox h-5 w-5" defaultChecked />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Save Learning History</h3>
                      <p className="text-sm text-muted-foreground">Track your learning progress across sessions</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="history" className="form-checkbox h-5 w-5" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSave}>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Email Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-course-updates">Course updates</Label>
                        <input type="checkbox" id="email-course-updates" className="form-checkbox h-5 w-5" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-new-resources">New resources</Label>
                        <input type="checkbox" id="email-new-resources" className="form-checkbox h-5 w-5" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email-progress-reminders">Progress reminders</Label>
                        <input type="checkbox" id="email-progress-reminders" className="form-checkbox h-5 w-5" defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Push Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="push-course-updates">Course updates</Label>
                        <input type="checkbox" id="push-course-updates" className="form-checkbox h-5 w-5" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="push-new-resources">New resources</Label>
                        <input type="checkbox" id="push-new-resources" className="form-checkbox h-5 w-5" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="push-progress-reminders">Progress reminders</Label>
                        <input type="checkbox" id="push-progress-reminders" className="form-checkbox h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSave}>Save Notifications</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security and password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Change Password</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-5">
                  <h3 className="font-medium mb-3">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Enhance your account security by enabling two-factor authentication.</p>
                    </div>
                    <Button variant="outline" size="sm">Enable 2FA</Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSave}>Update Password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Profile;
