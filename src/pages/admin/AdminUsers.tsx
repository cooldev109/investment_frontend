import { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import {
  Search,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Shield,
  User,
  LayoutGrid,
  Table,
} from 'lucide-react';
import api from '../../lib/api';
import { toast } from 'sonner';

interface UserData {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'investor';
  planKey: 'free' | 'basic' | 'plus' | 'premium';
  planStatus: 'active' | 'expired' | 'trial';
  createdAt: string;
  lastLogin?: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/users');
      setUsers(response.data.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
      // Mock data for demo
      setUsers([
        {
          _id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          role: 'investor',
          planKey: 'premium',
          planStatus: 'active',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        },
        {
          _id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+1234567891',
          role: 'investor',
          planKey: 'plus',
          planStatus: 'active',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`/users/${id}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const getRoleColor = (role: string) => {
    return role === 'admin'
      ? 'bg-gradient-to-r from-red-100 to-orange-100 text-red-700 border-red-200'
      : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 border-blue-200';
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'basic':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'plus':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'premium':
        return 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 p-8 text-white shadow-2xl">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white rounded-full blur-3xl" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-3 border border-white/30">
                <User size={18} />
                <span className="text-sm font-semibold">User Management</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Users Overview</h1>
              <p className="text-white/90 text-lg">
                Manage platform users and permissions • {filteredUsers.length} total users
              </p>
            </div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/30">
              <User size={20} />
              <span className="text-2xl font-bold">{users.length}</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" size={20} />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 border-2 border-purple-100 focus:border-purple-300 rounded-xl"
                />
              </div>
              <div className="flex gap-2 flex-wrap items-center">
                {['all', 'admin', 'investor'].map((role) => (
                  <Button
                    key={role}
                    variant={filterRole === role ? 'default' : 'outline'}
                    onClick={() => setFilterRole(role)}
                    className={`capitalize font-semibold px-5 rounded-xl transition-all duration-300 ${
                      filterRole === role
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg'
                        : 'border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    {role}
                  </Button>
                ))}
                <div className="h-8 w-px bg-purple-200 mx-1" />
                <div className="flex gap-1 bg-purple-50 p-1 rounded-lg border-2 border-purple-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('card')}
                    className={`px-3 rounded-md transition-all duration-300 ${
                      viewMode === 'card'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    <LayoutGrid size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('table')}
                    className={`px-3 rounded-md transition-all duration-300 ${
                      viewMode === 'table'
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-purple-600'
                    }`}
                  >
                    <Table size={18} />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Display */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
            <p className="text-gray-600 mt-4 font-medium">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="text-center py-20">
              <User className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-600 text-lg font-medium">No users found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
            </CardContent>
          </Card>
        ) : viewMode === 'card' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredUsers.map((user, index) => (
              <Card
                key={user._id}
                className="relative border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group bg-white overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Gradient accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700" />

                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg mb-2 truncate group-hover:text-purple-600 transition-colors">
                        {user.name}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={`${getRoleColor(user.role)} font-semibold`}>
                          {user.role === 'admin' ? <Shield size={12} className="mr-1" /> : <User size={12} className="mr-1" />}
                          {user.role}
                        </Badge>
                        <Badge className={`${getPlanColor(user.planKey)} font-semibold`}>
                          {user.planKey}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Contact Info */}
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Mail size={16} className="text-purple-600 flex-shrink-0" />
                      <span className="truncate font-medium">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Phone size={16} className="text-green-600 flex-shrink-0" />
                        <span className="font-medium">{user.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Account Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center gap-1 font-semibold">
                        <Calendar size={14} className="text-blue-600" />
                        <span>Joined</span>
                      </div>
                      <span className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                    {user.lastLogin && (
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span className="font-semibold">Last Login</span>
                        <span className="font-medium">{new Date(user.lastLogin).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t-2 border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300 text-purple-600 font-semibold rounded-xl"
                    >
                      <Edit size={16} className="mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-2 border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleDelete(user._id)}
                      disabled={user.role === 'admin'}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-xl bg-white overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b-2 border-purple-200">
                    <tr>
                      <th className="text-left p-4 font-bold text-gray-700">User</th>
                      <th className="text-left p-4 font-bold text-gray-700">Contact</th>
                      <th className="text-left p-4 font-bold text-gray-700">Role</th>
                      <th className="text-left p-4 font-bold text-gray-700">Plan</th>
                      <th className="text-left p-4 font-bold text-gray-700">Joined</th>
                      <th className="text-left p-4 font-bold text-gray-700">Last Login</th>
                      <th className="text-center p-4 font-bold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <tr
                        key={user._id}
                        className="border-b border-gray-100 hover:bg-purple-50/50 transition-colors duration-200"
                        style={{ animationDelay: `${index * 30}ms` }}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <p className="text-sm text-gray-700 flex items-center gap-1 font-medium">
                              <Mail size={14} className="text-purple-600" />
                              {user.email}
                            </p>
                            {user.phone && (
                              <p className="text-sm text-gray-700 flex items-center gap-1 font-medium">
                                <Phone size={14} className="text-green-600" />
                                {user.phone}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={`${getRoleColor(user.role)} font-semibold`}>
                            {user.role === 'admin' ? (
                              <Shield size={12} className="mr-1" />
                            ) : (
                              <User size={12} className="mr-1" />
                            )}
                            {user.role}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge className={`${getPlanColor(user.planKey)} font-semibold`}>
                            {user.planKey}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <p className="text-sm text-gray-700 flex items-center gap-1 font-medium">
                            <Calendar size={14} className="text-blue-600" />
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="p-4">
                          {user.lastLogin ? (
                            <p className="text-sm text-gray-700 font-medium">
                              {new Date(user.lastLogin).toLocaleDateString()}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-400">Never</p>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2 justify-center">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300 text-purple-600 font-semibold rounded-lg"
                            >
                              <Edit size={14} className="mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-2 border-red-200 hover:bg-red-50 hover:border-red-300 text-red-600 font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => handleDelete(user._id)}
                              disabled={user.role === 'admin'}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
