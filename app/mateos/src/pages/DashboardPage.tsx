import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, BookOpen, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const getRoleBadgeColor = () => {
    switch (user?.role) {
      case UserRole.ADMIN:
        return 'bg-red-500';
      case UserRole.TEACHER:
        return 'bg-blue-500';
      case UserRole.PARENT:
        return 'bg-green-500';
      case UserRole.STUDENT:
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const stats = [
    {
      title: 'Upcoming Consultations',
      value: '3',
      icon: Calendar,
      description: 'This week',
      color: 'from-blue-100 to-blue-200',
    },
    {
      title: 'Total Sessions',
      value: '24',
      icon: CheckCircle,
      description: 'All time',
      color: 'from-green-100 to-green-200',
    },
    {
      title: 'Hours Learned',
      value: '36',
      icon: Clock,
      description: 'This month',
      color: 'from-purple-100 to-purple-200',
    },
    {
      title: 'Progress',
      value: '85%',
      icon: TrendingUp,
      description: 'Improvement',
      color: 'from-orange-100 to-orange-200',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-50/20 to-purple-50/20 p-6">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's what's happening with your account
            </p>
          </div>
          <Badge className={`${getRoleBadgeColor()} text-white px-4 py-2`}>
            {user?.role}
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 bg-white/50 backdrop-blur-sm hover:shadow-lg transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-lg`}>
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="border-0 bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <Button className="h-auto py-6 flex-col gap-2 bg-gradient-to-br from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
              <Calendar className="h-6 w-6" />
              <span>Schedule Consultation</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex-col gap-2">
              <Users className="h-6 w-6" />
              <span>Browse Teachers</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex-col gap-2">
              <BookOpen className="h-6 w-6" />
              <span>View Materials</span>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest consultations and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-white/50">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-semibold">
                  MP
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Math Consultation - Algebra</p>
                  <p className="text-sm text-muted-foreground">with Prof. Maria Popescu</p>
                </div>
                <Badge>Completed</Badge>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-white/50">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                  II
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Geometry Session</p>
                  <p className="text-sm text-muted-foreground">with Prof. Ion Ionescu</p>
                </div>
                <Badge variant="secondary">Scheduled</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

