import React, { useState, useEffect, useCallback } from 'react';
import { Users, Building2, DollarSign, CheckSquare, Plus, Search, ChevronLeft, Trash2, Edit3, Phone, Mail, Tag, Calendar, Clock, ArrowRight, X, GripVertical } from 'lucide-react';
import { insforge } from '../../lib/insforge';
import { useAuthStore } from '../../store/authStore';
import classNames from 'classnames';

interface CrmContact {
    id: string; user_id: string; name: string; email: string; phone: string;
    company_id: string | null; notes: string; created_at: string;
}

interface CrmCompany {
    id: string; user_id: string; name: string; industry: string; website: string;
    employee_count: number; notes: string; created_at: string;
}

interface CrmDeal {
    id: string; user_id: string; contact_id: string | null; company_id: string | null;
    title: string; value: number; stage: string; notes: string; created_at: string; updated_at: string;
}

interface CrmTask {
    id: string; user_id: string; deal_id: string | null; title: string;
    due_date: string | null; is_completed: boolean; created_at: string;
}

interface CrmActivity {
    id: string; user_id: string; deal_id: string | null; contact_id: string | null;
    type: string; description: string; created_at: string;
}

type Tab = 'contacts' | 'companies' | 'deals' | 'tasks';
type SubView = 'list' | 'detail' | 'form';

const STAGES = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];
const STAGE_COLORS: Record<string, string> = {
    Lead: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    Qualified: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    Proposal: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    Negotiation: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    Won: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    Lost: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const CRMApp = () => {
    const { user } = useAuthStore();
    const [tab, setTab] = useState<Tab>('deals');
    const [subView, setSubView] = useState<SubView>('list');
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Data
    const [contacts, setContacts] = useState<CrmContact[]>([]);
    const [companies, setCompanies] = useState<CrmCompany[]>([]);
    const [deals, setDeals] = useState<CrmDeal[]>([]);
    const [tasks, setTasks] = useState<CrmTask[]>([]);
    const [activities, setActivities] = useState<CrmActivity[]>([]);

    // Selected
    const [selectedDeal, setSelectedDeal] = useState<CrmDeal | null>(null);

    // Form state
    const [formData, setFormData] = useState<any>({});
    const [editingId, setEditingId] = useState<string | null>(null);

    const uid = user?.id;

    const fetchAll = useCallback(async () => {
        if (!uid) return;
        setLoading(true);
        try {
            const [c, co, d, t] = await Promise.all([
                insforge.database.from('crm_contacts').select('*').eq('user_id', uid).order('created_at', { ascending: false }),
                insforge.database.from('crm_companies').select('*').eq('user_id', uid).order('created_at', { ascending: false }),
                insforge.database.from('crm_deals').select('*').eq('user_id', uid).order('updated_at', { ascending: false }),
                insforge.database.from('crm_tasks').select('*').eq('user_id', uid).order('due_date', { ascending: true }),
            ]);
            setContacts((c.data || []) as CrmContact[]);
            setCompanies((co.data || []) as CrmCompany[]);
            setDeals((d.data || []) as CrmDeal[]);
            setTasks((t.data || []) as CrmTask[]);
        } catch (e) { console.error(e); }
        setLoading(false);
    }, [uid]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const fetchActivities = async (dealId: string) => {
        const { data } = await insforge.database.from('crm_activities').select('*').eq('deal_id', dealId).order('created_at', { ascending: false });
        setActivities((data || []) as CrmActivity[]);
    };

    // CRUD helpers
    const saveContact = async () => {
        if (!uid || !formData.name) return;
        const payload = { user_id: uid, name: formData.name, email: formData.email || '', phone: formData.phone || '', company_id: formData.company_id || null, notes: formData.notes || '' };
        if (editingId) await insforge.database.from('crm_contacts').update(payload).eq('id', editingId);
        else await insforge.database.from('crm_contacts').insert([payload]);
        resetForm(); fetchAll();
    };

    const saveCompany = async () => {
        if (!uid || !formData.name) return;
        const payload = { user_id: uid, name: formData.name, industry: formData.industry || '', website: formData.website || '', employee_count: parseInt(formData.employee_count) || 0, notes: formData.notes || '' };
        if (editingId) await insforge.database.from('crm_companies').update(payload).eq('id', editingId);
        else await insforge.database.from('crm_companies').insert([payload]);
        resetForm(); fetchAll();
    };

    const saveDeal = async () => {
        if (!uid || !formData.title) return;
        const payload = { user_id: uid, title: formData.title, value: parseFloat(formData.value) || 0, stage: formData.stage || 'Lead', contact_id: formData.contact_id || null, company_id: formData.company_id || null, notes: formData.notes || '' };
        if (editingId) {
            await insforge.database.from('crm_deals').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editingId);
            await insforge.database.from('crm_activities').insert([{ user_id: uid, deal_id: editingId, type: 'update', description: `Deal updated` }]);
        } else {
            const { data } = await insforge.database.from('crm_deals').insert([payload]).select();
            if (data?.[0]) await insforge.database.from('crm_activities').insert([{ user_id: uid, deal_id: data[0].id, type: 'create', description: 'Deal created' }]);
        }
        resetForm(); fetchAll();
    };

    const saveTask = async () => {
        if (!uid || !formData.title) return;
        const payload = { user_id: uid, title: formData.title, deal_id: formData.deal_id || null, due_date: formData.due_date || null, is_completed: false };
        if (editingId) await insforge.database.from('crm_tasks').update(payload).eq('id', editingId);
        else await insforge.database.from('crm_tasks').insert([payload]);
        resetForm(); fetchAll();
    };

    const toggleTask = async (task: CrmTask) => {
        await insforge.database.from('crm_tasks').update({ is_completed: !task.is_completed }).eq('id', task.id);
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, is_completed: !t.is_completed } : t));
    };

    const deleteItem = async (table: string, id: string) => {
        if (!confirm('Delete this item?')) return;
        await insforge.database.from(table).delete().eq('id', id);
        fetchAll();
        if (subView === 'detail') setSubView('list');
    };

    const moveDealStage = async (deal: CrmDeal, newStage: string) => {
        await insforge.database.from('crm_deals').update({ stage: newStage, updated_at: new Date().toISOString() }).eq('id', deal.id);
        await insforge.database.from('crm_activities').insert([{ user_id: uid, deal_id: deal.id, type: 'stage_change', description: `Stage: ${deal.stage} → ${newStage}` }]);
        fetchAll();
        if (selectedDeal?.id === deal.id) {
            setSelectedDeal({ ...deal, stage: newStage });
            fetchActivities(deal.id);
        }
    };

    const resetForm = () => { setFormData({}); setEditingId(null); setSubView('list'); };
    const openForm = (data: any = {}, id: string | null = null) => { setFormData(data); setEditingId(id); setSubView('form'); };

    const openDealDetail = (deal: CrmDeal) => { setSelectedDeal(deal); setSubView('detail'); fetchActivities(deal.id); };

    const timeAgo = (date: string) => {
        const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
        if (s < 60) return 'just now';
        if (s < 3600) return `${Math.floor(s / 60)}m`;
        if (s < 86400) return `${Math.floor(s / 3600)}h`;
        return `${Math.floor(s / 86400)}d`;
    };

    const getContactName = (id: string | null) => contacts.find(c => c.id === id)?.name || '';
    const getCompanyName = (id: string | null) => companies.find(c => c.id === id)?.name || '';

    const tabs: { key: Tab; label: string; icon: any }[] = [
        { key: 'deals', label: 'Deals', icon: DollarSign },
        { key: 'contacts', label: 'Contacts', icon: Users },
        { key: 'companies', label: 'Companies', icon: Building2 },
        { key: 'tasks', label: 'Tasks', icon: CheckSquare },
    ];

    // ─── Deal Detail ───
    if (subView === 'detail' && selectedDeal) {
        const dealTasks = tasks.filter(t => t.deal_id === selectedDeal.id);
        return (
            <div className="h-full w-full bg-gray-50 dark:bg-[#121212] overflow-y-auto pb-24">
                <div className="w-full bg-surface-light dark:bg-surface-dark px-6 pt-12 pb-4 sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSubView('list')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"><ChevronLeft size={24} /></button>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedDeal.title}</h1>
                            <p className="text-sm text-gray-500">${selectedDeal.value.toLocaleString()}</p>
                        </div>
                        <button onClick={() => openForm({ title: selectedDeal.title, value: selectedDeal.value, stage: selectedDeal.stage, contact_id: selectedDeal.contact_id, company_id: selectedDeal.company_id, notes: selectedDeal.notes }, selectedDeal.id)}
                            className="p-2 text-gray-400 hover:text-primary-light"><Edit3 size={20} /></button>
                        <button onClick={() => deleteItem('crm_deals', selectedDeal.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={20} /></button>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
                    {/* Stage Pipeline */}
                    <div className="bg-white dark:bg-[#1A1C1E] rounded-2xl p-4 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-500 mb-3">Pipeline</h3>
                        <div className="flex gap-1 overflow-x-auto pb-1">
                            {STAGES.map(s => (
                                <button key={s} onClick={() => moveDealStage(selectedDeal, s)}
                                    className={classNames('px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all',
                                        selectedDeal.stage === s ? STAGE_COLORS[s] + ' ring-2 ring-offset-1 ring-current' : 'bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-gray-700'
                                    )}>
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="bg-white dark:bg-[#1A1C1E] rounded-2xl p-4 shadow-sm space-y-3">
                        {selectedDeal.contact_id && <div className="flex items-center gap-2 text-sm"><Users size={16} className="text-gray-400" /> <span className="text-gray-700 dark:text-gray-300">{getContactName(selectedDeal.contact_id)}</span></div>}
                        {selectedDeal.company_id && <div className="flex items-center gap-2 text-sm"><Building2 size={16} className="text-gray-400" /> <span className="text-gray-700 dark:text-gray-300">{getCompanyName(selectedDeal.company_id)}</span></div>}
                        {selectedDeal.notes && <p className="text-sm text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">{selectedDeal.notes}</p>}
                    </div>

                    {/* Tasks */}
                    <div className="bg-white dark:bg-[#1A1C1E] rounded-2xl p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-semibold text-gray-500">Tasks</h3>
                            <button onClick={() => openForm({ deal_id: selectedDeal.id }, null)} className="text-primary-light text-xs font-semibold">+ Add</button>
                        </div>
                        {dealTasks.length === 0 && <p className="text-sm text-gray-400">No tasks</p>}
                        {dealTasks.map(t => (
                            <div key={t.id} className="flex items-center gap-3 py-2">
                                <button onClick={() => toggleTask(t)} className={classNames('w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors',
                                    t.is_completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 dark:border-gray-600')}>
                                    {t.is_completed && <CheckSquare size={12} />}
                                </button>
                                <span className={classNames('text-sm flex-1', t.is_completed && 'line-through text-gray-400')}>{t.title}</span>
                                {t.due_date && <span className="text-xs text-gray-400">{new Date(t.due_date).toLocaleDateString()}</span>}
                            </div>
                        ))}
                    </div>

                    {/* Activity Timeline */}
                    <div className="bg-white dark:bg-[#1A1C1E] rounded-2xl p-4 shadow-sm">
                        <h3 className="text-sm font-semibold text-gray-500 mb-3">Activity</h3>
                        {activities.length === 0 && <p className="text-sm text-gray-400">No activity</p>}
                        <div className="space-y-3">
                            {activities.map(a => (
                                <div key={a.id} className="flex gap-3 items-start">
                                    <div className="w-2 h-2 mt-1.5 rounded-full bg-primary-light shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">{a.description}</p>
                                        <span className="text-xs text-gray-400">{timeAgo(a.created_at)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ─── Form ───
    if (subView === 'form') {
        const isEdit = !!editingId;
        const formTitle = tab === 'contacts' ? 'Contact' : tab === 'companies' ? 'Company' : tab === 'tasks' ? 'Task' : 'Deal';
        const onSave = tab === 'contacts' ? saveContact : tab === 'companies' ? saveCompany : tab === 'tasks' ? saveTask : saveDeal;

        return (
            <div className="h-full w-full bg-gray-50 dark:bg-[#121212] overflow-y-auto pb-24">
                <div className="w-full bg-surface-light dark:bg-surface-dark px-6 pt-12 pb-4 sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button onClick={resetForm} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"><ChevronLeft size={24} /></button>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{isEdit ? 'Edit' : 'New'} {formTitle}</h1>
                    </div>
                </div>
                <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
                    {(tab === 'contacts' || tab === 'deals' || tab === 'tasks') && (
                        <Input label={tab === 'tasks' ? 'Task' : tab === 'deals' ? 'Deal Title' : 'Name'} value={formData.name || formData.title || ''} onChange={v => setFormData({ ...formData, [tab === 'contacts' ? 'name' : 'title']: v })} />
                    )}
                    {tab === 'companies' && <Input label="Company Name" value={formData.name || ''} onChange={v => setFormData({ ...formData, name: v })} />}
                    {tab === 'contacts' && (
                        <>
                            <Input label="Email" value={formData.email || ''} onChange={v => setFormData({ ...formData, email: v })} />
                            <Input label="Phone" value={formData.phone || ''} onChange={v => setFormData({ ...formData, phone: v })} />
                        </>
                    )}
                    {tab === 'companies' && (
                        <>
                            <Input label="Industry" value={formData.industry || ''} onChange={v => setFormData({ ...formData, industry: v })} />
                            <Input label="Website" value={formData.website || ''} onChange={v => setFormData({ ...formData, website: v })} />
                            <Input label="Employees" value={formData.employee_count || ''} onChange={v => setFormData({ ...formData, employee_count: v })} type="number" />
                        </>
                    )}
                    {tab === 'deals' && (
                        <>
                            <Input label="Value ($)" value={formData.value || ''} onChange={v => setFormData({ ...formData, value: v })} type="number" />
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Stage</label>
                                <div className="flex flex-wrap gap-2">
                                    {STAGES.map(s => (
                                        <button key={s} onClick={() => setFormData({ ...formData, stage: s })}
                                            className={classNames('px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
                                                formData.stage === s ? STAGE_COLORS[s] : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                                            )}>{s}</button>
                                    ))}
                                </div>
                            </div>
                            {contacts.length > 0 && (
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Contact</label>
                                    <select value={formData.contact_id || ''} onChange={e => setFormData({ ...formData, contact_id: e.target.value || null })}
                                        className="w-full bg-white dark:bg-[#1A1C1E] border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 outline-none">
                                        <option value="">None</option>
                                        {contacts.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            )}
                        </>
                    )}
                    {tab === 'tasks' && (
                        <Input label="Due Date" value={formData.due_date || ''} onChange={v => setFormData({ ...formData, due_date: v })} type="date" />
                    )}
                    {(tab === 'contacts' || tab === 'companies' || tab === 'deals') && (
                        <div>
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Notes</label>
                            <textarea value={formData.notes || ''} onChange={e => setFormData({ ...formData, notes: e.target.value })} rows={3}
                                className="w-full bg-white dark:bg-[#1A1C1E] border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 outline-none resize-none" />
                        </div>
                    )}
                    <button onClick={onSave} className="w-full bg-primary-light text-white py-3 rounded-2xl font-semibold hover:shadow-lg transition-all">
                        {isEdit ? 'Update' : 'Create'} {formTitle}
                    </button>
                </div>
            </div>
        );
    }

    // ─── List View ───
    const filterItems = (items: any[]) => items.filter(i => (i.name || i.title || '').toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="h-full w-full bg-gray-50 dark:bg-[#121212] overflow-y-auto pb-24">
            <div className="w-full bg-surface-light dark:bg-surface-dark px-6 pt-12 pb-4 sticky top-0 z-20 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-[32px] font-bold text-gray-900 dark:text-white tracking-tight">CRM</h1>
                    <button onClick={() => openForm(tab === 'deals' ? { stage: 'Lead' } : {})}
                        className="w-10 h-10 rounded-full bg-primary-light text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all">
                        <Plus size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                    {tabs.map(t => {
                        const Icon = t.icon;
                        return (
                            <button key={t.key} onClick={() => { setTab(t.key); setSearch(''); }}
                                className={classNames('px-4 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap',
                                    tab === t.key ? 'bg-primary-light text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                )}>
                                <Icon size={16} /> {t.label}
                            </button>
                        );
                    })}
                </div>

                <div className="relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${tab}...`}
                        className="w-full bg-gray-100 dark:bg-gray-800 rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-light/50" />
                </div>
            </div>

            <div className="max-w-2xl mx-auto w-full px-4 md:px-0 py-4">
                {loading && <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-primary-light border-t-transparent rounded-full animate-spin" /></div>}

                {/* Deals - Kanban-lite */}
                {tab === 'deals' && !loading && (
                    <>
                        {/* Stage summary */}
                        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                            {STAGES.filter(s => deals.some(d => d.stage === s)).map(s => {
                                const count = deals.filter(d => d.stage === s).length;
                                const total = deals.filter(d => d.stage === s).reduce((acc, d) => acc + d.value, 0);
                                return (
                                    <div key={s} className={classNames('px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap', STAGE_COLORS[s])}>
                                        {s}: {count} (${total.toLocaleString()})
                                    </div>
                                );
                            })}
                        </div>
                        {filterItems(deals).length === 0 && <EmptyState icon={DollarSign} text="No deals yet" />}
                        <div className="flex flex-col gap-3">
                            {filterItems(deals).map(d => (
                                <div key={d.id} onClick={() => openDealDetail(d)}
                                    className="bg-white dark:bg-[#1A1C1E] rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-bold text-gray-900 dark:text-white">{d.title}</h3>
                                        <span className={classNames('px-2.5 py-1 rounded-lg text-xs font-semibold', STAGE_COLORS[d.stage])}>{d.stage}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span className="font-semibold text-green-600">${d.value.toLocaleString()}</span>
                                        {d.contact_id && <span className="flex items-center gap-1"><Users size={14} />{getContactName(d.contact_id)}</span>}
                                        <span className="text-xs">{timeAgo(d.updated_at)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Contacts */}
                {tab === 'contacts' && !loading && (
                    <>
                        {filterItems(contacts).length === 0 && <EmptyState icon={Users} text="No contacts yet" />}
                        <div className="flex flex-col gap-3">
                            {filterItems(contacts).map(c => (
                                <div key={c.id} className="bg-white dark:bg-[#1A1C1E] rounded-2xl p-4 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">{c.name}</h3>
                                            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                                {c.email && <span className="flex items-center gap-1"><Mail size={14} />{c.email}</span>}
                                                {c.phone && <span className="flex items-center gap-1"><Phone size={14} />{c.phone}</span>}
                                            </div>
                                            {c.company_id && <span className="text-xs text-primary-light">{getCompanyName(c.company_id)}</span>}
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => openForm({ name: c.name, email: c.email, phone: c.phone, company_id: c.company_id, notes: c.notes }, c.id)}
                                                className="p-2 text-gray-400 hover:text-primary-light"><Edit3 size={16} /></button>
                                            <button onClick={() => deleteItem('crm_contacts', c.id)}
                                                className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Companies */}
                {tab === 'companies' && !loading && (
                    <>
                        {filterItems(companies).length === 0 && <EmptyState icon={Building2} text="No companies yet" />}
                        <div className="flex flex-col gap-3">
                            {filterItems(companies).map(c => (
                                <div key={c.id} className="bg-white dark:bg-[#1A1C1E] rounded-2xl p-4 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">{c.name}</h3>
                                            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                                {c.industry && <span>{c.industry}</span>}
                                                {c.employee_count > 0 && <span>{c.employee_count} employees</span>}
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={() => openForm({ name: c.name, industry: c.industry, website: c.website, employee_count: c.employee_count, notes: c.notes }, c.id)}
                                                className="p-2 text-gray-400 hover:text-primary-light"><Edit3 size={16} /></button>
                                            <button onClick={() => deleteItem('crm_companies', c.id)}
                                                className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Tasks */}
                {tab === 'tasks' && !loading && (
                    <>
                        {filterItems(tasks).length === 0 && <EmptyState icon={CheckSquare} text="No tasks yet" />}
                        <div className="flex flex-col gap-2">
                            {filterItems(tasks).map(t => (
                                <div key={t.id} className="bg-white dark:bg-[#1A1C1E] rounded-2xl p-4 shadow-sm flex items-center gap-3">
                                    <button onClick={() => toggleTask(t)}
                                        className={classNames('w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors shrink-0',
                                            t.is_completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 dark:border-gray-600')}>
                                        {t.is_completed && <CheckSquare size={14} />}
                                    </button>
                                    <div className="flex-1 min-w-0">
                                        <span className={classNames('text-sm font-medium', t.is_completed && 'line-through text-gray-400')}>{t.title}</span>
                                        <div className="flex gap-2 mt-0.5">
                                            {t.due_date && <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={12} />{new Date(t.due_date).toLocaleDateString()}</span>}
                                            {t.deal_id && <span className="text-xs text-primary-light">{deals.find(d => d.id === t.deal_id)?.title}</span>}
                                        </div>
                                    </div>
                                    <button onClick={() => deleteItem('crm_tasks', t.id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const Input = ({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) => (
    <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">{label}</label>
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
            className="w-full bg-white dark:bg-[#1A1C1E] border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-light/50" />
    </div>
);

const EmptyState = ({ icon: Icon, text }: { icon: any; text: string }) => (
    <div className="text-center py-16">
        <Icon size={48} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-bold text-gray-500">{text}</h3>
    </div>
);

export default CRMApp;
