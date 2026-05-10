import { useEffect, useState, FormEvent } from 'react';
import api from '../api/axios';

interface City {
    _id: string;
    name: string;
    slug: string;
    state: string;
    description: string;
    image: string;
    totalSpots: number;
    isActive: boolean;
}

export default function CitiesPage() {
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCity, setEditingCity] = useState<City | null>(null);
    const [form, setForm] = useState({ name: '', state: '', description: '', image: '' });

    const fetchCities = () => {
        api.get('/admin/cities')
            .then((res) => setCities((res.data.data || res.data).cities || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchCities(); }, []);

    const resetForm = () => { setForm({ name: '', state: '', description: '', image: '' }); setEditingCity(null); setShowForm(false); };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            if (editingCity) {
                await api.put(`/admin/cities/${editingCity._id}`, form);
            } else {
                await api.post('/admin/cities', form);
            }
            resetForm();
            fetchCities();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error saving city');
        }
    };

    const handleEdit = (city: City) => {
        setEditingCity(city);
        setForm({ name: city.name, state: city.state, description: city.description, image: city.image });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this city and all its spots?')) return;
        try {
            await api.delete(`/admin/cities/${id}`);
            fetchCities();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error deleting city');
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">Cities</h1>
                    <p className="text-dark-400 mt-1">Manage cities across India</p>
                </div>
                <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-all">
                    {showForm ? 'Cancel' : '+ Add City'}
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="bg-dark-900 border border-dark-700 rounded-xl p-6 mb-6 space-y-4">
                    <h3 className="text-lg font-semibold text-white">{editingCity ? 'Edit City' : 'Add New City'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input placeholder="City Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                        <input placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required className="px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                        <input placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                        <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="px-4 py-2.5 bg-dark-800 border border-dark-600 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50" />
                    </div>
                    <button type="submit" className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-all">
                        {editingCity ? 'Update City' : 'Create City'}
                    </button>
                </form>
            )}

            {/* Table */}
            {loading ? (
                <div className="text-dark-400 text-center py-12">Loading cities...</div>
            ) : (
                <div className="bg-dark-900 border border-dark-700 rounded-xl overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-dark-700">
                                <th className="text-left px-6 py-4 text-sm font-medium text-dark-400">City</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-dark-400">State</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-dark-400">Slug</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-dark-400">Spots</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-dark-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cities.map((city) => (
                                <tr key={city._id} className="border-b border-dark-800 hover:bg-dark-800/50 transition-all">
                                    <td className="px-6 py-4 text-sm text-white font-medium">{city.name}</td>
                                    <td className="px-6 py-4 text-sm text-dark-300">{city.state}</td>
                                    <td className="px-6 py-4 text-sm text-dark-400 font-mono">{city.slug}</td>
                                    <td className="px-6 py-4 text-sm text-dark-300">{city.totalSpots}</td>
                                    <td className="px-6 py-4 text-sm space-x-2">
                                        <button onClick={() => handleEdit(city)} className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-md hover:bg-blue-500/20 transition-all">Edit</button>
                                        <button onClick={() => handleDelete(city._id)} className="px-3 py-1 bg-red-500/10 text-red-400 rounded-md hover:bg-red-500/20 transition-all">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {cities.length === 0 && <div className="text-center py-12 text-dark-400">No cities yet. Add one above!</div>}
                </div>
            )}
        </div>
    );
}
