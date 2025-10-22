import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { adminService, type PagedResult, type UserDto } from '@/services/adminService';
import { Ban, CheckCircle, Edit, Search, Shield, Trash2, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState<PagedResult<UserDto>>({ items: [], totalCount: 0, page: 1, pageSize: 20, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const pageSize = 20;

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, roleFilter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      let result;
      if (roleFilter !== 'All') {
        result = await adminService.getUsersByRole(roleFilter, { page: currentPage, pageSize });
      } else {
        result = await adminService.getAllUsers({ page: currentPage, pageSize });
      }
      setUsers(result);
    } catch {
      toast({
        variant: 'destructive',
        title: 'Eroare',
        description: 'Nu s-au putut încărca utilizatorii',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Implementare căutare pe backend
    loadUsers();
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await adminService.toggleUserStatus(userId, !currentStatus);
      toast({
        title: 'Succes',
        description: `Utilizatorul a fost ${!currentStatus ? 'activat' : 'dezactivat'}`,
      });
      loadUsers();
    } catch {
      toast({
        variant: 'destructive',
        title: 'Eroare',
        description: 'Nu s-a putut actualiza statusul utilizatorului',
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      await adminService.deleteUser(selectedUser.id);
      toast({
        title: 'Succes',
        description: 'Utilizatorul a fost șters',
      });
      setIsDeleteDialogOpen(false);
      loadUsers();
    } catch {
      toast({
        variant: 'destructive',
        title: 'Eroare',
        description: 'Nu s-a putut șterge utilizatorul',
      });
    }
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      'Administrator': 'destructive',
      'Admin': 'destructive',
      'Teacher': 'default',
      'Student': 'secondary',
      'Parent': 'outline',
    };
    
    const labels: Record<string, string> = {
      'Administrator': 'Administrator',
      'Admin': 'Administrator',
      'Teacher': 'Profesor',
      'Student': 'Elev',
      'Parent': 'Părinte',
    };

    return (
      <Badge variant={variants[role] || 'default'}>
        {labels[role] || role}
      </Badge>
    );
  };

  const filteredUsers = users.items.filter(user => 
    searchQuery === '' || 
    user.firstname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestionare utilizatori</h1>
          <p className="text-muted-foreground">
            Administrează toți utilizatorii platformei
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Adaugă utilizator
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtrare și căutare</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Caută după nume sau email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">Toate rolurile</SelectItem>
                <SelectItem value="Administrator">Administrator</SelectItem>
                <SelectItem value="Teacher">Profesor</SelectItem>
                <SelectItem value="Student">Elev</SelectItem>
                <SelectItem value="Parent">Părinte</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch}>Caută</Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Utilizatori ({users.totalCount})</CardTitle>
          <CardDescription>
            Lista completă a utilizatorilor înregistrați
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Se încarcă...</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nume</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Telefon</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data înregistrării</TableHead>
                    <TableHead className="text-right">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.firstname} {user.lastname}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{user.phoneNumber || '-'}</TableCell>
                      <TableCell>
                        {user.isActive ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Activ
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700">
                            <Ban className="mr-1 h-3 w-3" />
                            Inactiv
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString('ro-RO')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(user.id, user.isActive)}
                          >
                            {user.isActive ? (
                              <Ban className="h-4 w-4 text-orange-600" />
                            ) : (
                              <Shield className="h-4 w-4 text-green-600" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Pagina {users.page} din {users.totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === users.totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                  >
                    Următorul
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editează utilizator</DialogTitle>
            <DialogDescription>
              Modifică informațiile utilizatorului
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="firstname">Prenume</Label>
                <Input id="firstname" defaultValue={selectedUser.firstname} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Nume</Label>
                <Input id="lastname" defaultValue={selectedUser.lastname} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" defaultValue={selectedUser.phoneNumber || ''} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Anulează
            </Button>
            <Button>Salvează modificările</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmare ștergere</DialogTitle>
            <DialogDescription>
              Ești sigur că vrei să ștergi utilizatorul <strong>{selectedUser?.firstname} {selectedUser?.lastname}</strong>?
              Această acțiune nu poate fi anulată.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Anulează
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Șterge utilizatorul
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
