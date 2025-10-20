import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { adminService } from '@/services';
import type { CreateGroupDto, GroupDto } from '@/services/adminService';
import { Plus, Search, Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

export function AdminGroupsPage() {
  const [groups, setGroups] = useState<GroupDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredGroups, setFilteredGroups] = useState<GroupDto[]>([]);

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupDto | null>(null);

  // Form states
  const [formData, setFormData] = useState<CreateGroupDto>({
    studentClass: '',
    name: '',
    teacherId: '',
  });

  useEffect(() => {
    loadGroups();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = groups.filter(
        (group) =>
          group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          group.studentClass.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredGroups(filtered);
    } else {
      setFilteredGroups(groups);
    }
  }, [groups, searchTerm]);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const result = await adminService.getAllGroups();
      setGroups(result);
      setFilteredGroups(result);
    } catch (error) {
      console.error('Failed to load groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    try {
      await adminService.createGroup(formData);
      setIsCreateDialogOpen(false);
      setFormData({
        studentClass: '',
        name: '',
        teacherId: '',
      });
      loadGroups();
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  const handleDeleteGroup = async () => {
    if (!selectedGroup) return;
    try {
      await adminService.deleteGroup(selectedGroup.id);
      setIsDeleteDialogOpen(false);
      setSelectedGroup(null);
      loadGroups();
    } catch (error) {
      console.error('Failed to delete group:', error);
    }
  };

  const openDeleteDialog = (group: GroupDto) => {
    setSelectedGroup(group);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestionare Grupuri</h1>
        <p className="text-gray-600">Administrează toate grupurile din platformă</p>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Caută după nume sau clasă..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Grup Nou
          </Button>
        </div>
      </div>

      {/* Groups Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nume</TableHead>
                  <TableHead>Clasă</TableHead>
                  <TableHead>Membri</TableHead>
                  <TableHead>Profesor</TableHead>
                  <TableHead>Data Creării</TableHead>
                  <TableHead className="text-right">Acțiuni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGroups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell className="font-medium">{group.name}</TableCell>
                    <TableCell>{group.studentClass}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        <Users className="h-3 w-3 mr-1" />
                        {group.studentCount || 0}
                      </Badge>
                    </TableCell>
                    <TableCell>{group.teacherName || '-'}</TableCell>
                    <TableCell>{new Date(group.createdAt).toLocaleDateString('ro-RO')}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteDialog(group)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Total Count */}
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-gray-600">
                Total: {filteredGroups.length} {filteredGroups.length === 1 ? 'grup' : 'grupuri'}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Create Group Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Creează Grup Nou</DialogTitle>
            <DialogDescription>
              Adaugă un grup nou în platformă
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Clasă</label>
              <Input
                value={formData.studentClass}
                onChange={(e) => setFormData({ ...formData, studentClass: e.target.value })}
                placeholder="Ex: 10A, 11B"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Nume (opțional)</label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Se va genera automat dacă nu este specificat"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">ID Profesor (opțional)</label>
              <Input
                value={formData.teacherId || ''}
                onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                placeholder="ID-ul profesorului care va coordona grupul"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Anulează
            </Button>
            <Button onClick={handleCreateGroup}>Creează</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmă Ștergerea</DialogTitle>
            <DialogDescription>
              Sigur doriți să ștergeți grupul "{selectedGroup?.name}"? Această acțiune nu poate fi anulată.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Anulează
            </Button>
            <Button variant="destructive" onClick={handleDeleteGroup}>
              Șterge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
