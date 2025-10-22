/**
 * AdminGroupManagementPage - Pagină pentru administratori să gestioneze grupuri
 * 
 * Funcționalitate:
 * - Lista tuturor grupurilor cu filtre
 * - Creare grup nou
 * - Editare detalii grup
 * - Gestionare membri (adăugare/eliminare elevi)
 * - Statistici grup (prezență, venit, activitate)
 * 
 * @author Mateos Platform
 * @version 1.0
 * @date October 2025
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { GroupService } from '@/services/groupService';
import type { Group } from '@/types';
import { 
  Calendar, 
  Edit, 
  Filter, 
  GraduationCap, 
  Plus, 
  Search, 
  Trash2, 
  TrendingUp, 
  Users,
  UsersIcon
} from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface GroupFilters {
  class?: string;
  subject?: string;
  status?: 'active' | 'inactive' | 'all';
  search?: string;
}

export const AdminGroupManagementPage: FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<GroupFilters>({
    status: 'all'
  });

  // Load groups on mount
  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const allGroups = await GroupService.getAllGroups();
      setGroups(allGroups);
    } catch (error) {
      console.error('Error loading groups:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut încărca grupurile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = () => {
    navigate('/admin/groups/create');
  };

  const handleEditGroup = (groupId: string) => {
    navigate(`/admin/groups/${groupId}/edit`);
  };

  const handleViewGroup = (groupId: string) => {
    navigate(`/groups/${groupId}`);
  };

  const handleDeleteGroup = async (groupId: string, groupName: string) => {
    if (!confirm(`Ești sigur că vrei să ștergi grupul "${groupName}"? Această acțiune este ireversibilă.`)) {
      return;
    }

    try {
      await GroupService.delete(groupId);
      toast({
        title: 'Succes',
        description: 'Grupul a fost șters cu succes',
      });
      loadGroups();
    } catch (error) {
      console.error('Error deleting group:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut șterge grupul',
        variant: 'destructive',
      });
    }
  };

  const filteredGroups = groups.filter(group => {
    if (filters.class && group.class !== filters.class) return false;
    if (filters.subject && group.subject !== filters.subject) return false;
    if (filters.status === 'active' && !group.isActive) return false;
    if (filters.status === 'inactive' && group.isActive) return false;
    if (filters.search && !group.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const getCapacityColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage < 80) return 'text-green-600';
    if (percentage < 100) return 'text-orange-600';
    return 'text-red-600';
  };

  const getCapacityBadge = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage < 80) return 'bg-green-100 text-green-800';
    if (percentage < 100) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestionare Grupuri</h1>
          <p className="text-muted-foreground">
            Gestionează grupurile de elevi și consultațiile de grup
          </p>
        </div>
        <Button onClick={handleCreateGroup}>
          <Plus className="h-4 w-4 mr-2" />
          Grup Nou
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <UsersIcon className="h-4 w-4 text-blue-600" />
              Total Grupuri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{groups.length}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {groups.filter(g => g.isActive).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4 text-green-600" />
              Total Elevi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {groups.reduce((sum, group) => sum + (group.members?.length || 0), 0)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              în toate grupurile
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              Grupuri Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {groups.filter(g => g.members && g.members.length >= g.maxCapacity).length}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              la capacitate maximă
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-purple-600" />
              Consultații Săptămâna
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {groups.reduce((sum, group) => sum + (Array.isArray(group.upcomingConsultations) ? group.upcomingConsultations.length : (typeof group.upcomingConsultations === "number" ? group.upcomingConsultations : 0)), 0)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              programate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtre
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Căutare</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nume grup..."
                  value={filters.search || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="class">Clasă</Label>
              <Select
                value={filters.class || 'all'}
                onValueChange={(value) => setFilters(prev => ({ ...prev, class: value === 'all' ? undefined : value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Toate clasele" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toate clasele</SelectItem>
                  <SelectItem value="8">Clasa 8</SelectItem>
                  <SelectItem value="9">Clasa 9</SelectItem>
                  <SelectItem value="10">Clasa 10</SelectItem>
                  <SelectItem value="11">Clasa 11</SelectItem>
                  <SelectItem value="12">Clasa 12</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Materie</Label>
              <Select
                value={filters.subject || 'all'}
                onValueChange={(value) => setFilters(prev => ({ ...prev, subject: value === 'all' ? undefined : value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Toate materiile" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toate materiile</SelectItem>
                  <SelectItem value="matematica">Matematică</SelectItem>
                  <SelectItem value="fizica">Fizică</SelectItem>
                  <SelectItem value="chimia">Chimie</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={filters.status || 'all'}
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Toate statusurile" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toate</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Groups Table */}
      <Card>
        <CardHeader>
          <CardTitle>Grupuri ({filteredGroups.length})</CardTitle>
          <CardDescription>
            Lista tuturor grupurilor cu opțiuni de gestionare
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredGroups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <UsersIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="mb-2">Nu există grupuri</p>
              <p className="text-sm mb-4">Creează primul grup pentru a începe</p>
              <Button onClick={handleCreateGroup}>
                <Plus className="h-4 w-4 mr-2" />
                Grup Nou
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nume Grup</TableHead>
                  <TableHead>Clasă</TableHead>
                  <TableHead>Materie</TableHead>
                  <TableHead>Capacitate</TableHead>
                  <TableHead>Profesor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGroups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell className="font-medium">
                      <div>
                        <p className="font-semibold">{group.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {group.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        Clasa {group.class}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {group.subject}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={getCapacityColor(group.members?.length || 0, group.maxCapacity)}>
                          {group.members?.length || 0}/{group.maxCapacity}
                        </span>
                        <Badge className={getCapacityBadge(group.members?.length || 0, group.maxCapacity)}>
                          {group.members && group.members.length >= group.maxCapacity ? 'Complet' : 'Disponibil'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {group.teacherName || 'Nedefinit'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={group.isActive ? 'default' : 'secondary'}>
                        {group.isActive ? 'Activ' : 'Inactiv'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewGroup(group.id)}
                        >
                          Vezi
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditGroup(group.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteGroup(group.id, group.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
