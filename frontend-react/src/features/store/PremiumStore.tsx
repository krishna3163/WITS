import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, ShoppingCart, Plus, Minus, X, Trash2, ChevronLeft, Package, Upload, Edit, Tag } from 'lucide-react';
import { insforge } from '../../lib/insforge';
import { useAuthStore } from '../../store/authStore';
import classNames from 'classnames';

interface Product {
    id: string; user_id: string; name: string; description: string;
    price: number; image_url: string; category: string; created_at: string;
}
interface CartItem { product: Product; quantity: number; }

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Home', 'Books', 'Food', 'Sports', 'Other'];

const PremiumStore = () => {
    const { user } = useAuthStore();
    const [view, setView] = useState<'shop' | 'cart' | 'checkout' | 'add' | 'success'>('shop');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const [cart, setCart] = useState<CartItem[]>([]);

    // Add/Edit product
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [pName, setPName] = useState('');
    const [pDesc, setPDesc] = useState('');
    const [pPrice, setPPrice] = useState('');
    const [pCategory, setPCategory] = useState('Electronics');
    const [pFile, setPFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    // Checkout
    const [shipName, setShipName] = useState('');
    const [shipAddress, setShipAddress] = useState('');
    const [shipCity, setShipCity] = useState('');
    const [shipState, setShipState] = useState('');
    const [shipZip, setShipZip] = useState('');
    const [shipPhone, setShipPhone] = useState('');

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        let query = insforge.database.from('products').select('*').order('created_at', { ascending: false });
        if (category !== 'All') query = query.eq('category', category);
        const { data } = await query;
        setProducts((data || []) as Product[]);
        setLoading(false);
    }, [category]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const filtered = products.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase()));
    const cartTotal = cart.reduce((sum, ci) => sum + ci.product.price * ci.quantity, 0);
    const cartCount = cart.reduce((sum, ci) => sum + ci.quantity, 0);

    const addToCart = (p: Product) => {
        setCart(prev => {
            const existing = prev.find(ci => ci.product.id === p.id);
            if (existing) return prev.map(ci => ci.product.id === p.id ? { ...ci, quantity: ci.quantity + 1 } : ci);
            return [...prev, { product: p, quantity: 1 }];
        });
    };

    const updateQty = (id: string, delta: number) => {
        setCart(prev => prev.map(ci => ci.product.id === id ? { ...ci, quantity: Math.max(1, ci.quantity + delta) } : ci));
    };

    const removeFromCart = (id: string) => setCart(prev => prev.filter(ci => ci.product.id !== id));

    const openAdd = (p?: Product) => {
        if (p) {
            setEditProduct(p); setPName(p.name); setPDesc(p.description); setPPrice(String(p.price)); setPCategory(p.category);
        } else {
            setEditProduct(null); setPName(''); setPDesc(''); setPPrice(''); setPCategory('Electronics');
        }
        setPFile(null);
        setView('add');
    };

    const saveProduct = async () => {
        if (!user?.id || !pName || !pPrice) return;
        setSaving(true);
        let imageUrl = editProduct?.image_url || '';
        if (pFile) {
            const fileName = `products/${user.id}/${Date.now()}_${pFile.name}`;
            await insforge.storage.from('products').upload(fileName, pFile);
            imageUrl = insforge.storage.from('products').getPublicUrl(fileName);
        }
        if (editProduct) {
            await insforge.database.from('products').update({ name: pName, description: pDesc, price: parseFloat(pPrice), category: pCategory, image_url: imageUrl }).eq('id', editProduct.id);
        } else {
            await insforge.database.from('products').insert([{ user_id: user.id, name: pName, description: pDesc, price: parseFloat(pPrice), category: pCategory, image_url: imageUrl }]);
        }
        setSaving(false);
        setView('shop');
        fetchProducts();
    };

    const deleteProduct = async (id: string) => {
        if (!confirm('Delete this product?')) return;
        await insforge.database.from('products').delete().eq('id', id);
        fetchProducts();
    };

    const placeOrder = async () => {
        if (!user?.id || cart.length === 0) return;
        setSaving(true);
        const { data: orderData } = await insforge.database.from('orders').insert([{
            user_id: user.id, total: cartTotal, status: 'pending',
            shipping_name: shipName, shipping_address: shipAddress, shipping_city: shipCity,
            shipping_state: shipState, shipping_zip: shipZip, shipping_phone: shipPhone,
        }]).select();
        if (orderData?.[0]) {
            const items = cart.map(ci => ({
                order_id: orderData[0].id, product_id: ci.product.id,
                product_name: ci.product.name, price: ci.product.price, quantity: ci.quantity,
            }));
            await insforge.database.from('order_items').insert(items);
        }
        setCart([]);
        setSaving(false);
        setView('success');
    };

    // VIEWS
    if (view === 'success') return (
        <div className="h-full flex items-center justify-center bg-surface-light dark:bg-surface-dark">
            <div className="text-center animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package size={40} className="text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Order Placed!</h2>
                <p className="text-gray-500 mb-8">Your order has been confirmed and is being processed.</p>
                <button onClick={() => setView('shop')} className="bg-primary-light text-white px-8 py-3 rounded-2xl font-semibold">Continue Shopping</button>
            </div>
        </div>
    );

    if (view === 'add') return (
        <div className="h-full overflow-y-auto bg-surface-light dark:bg-surface-dark pb-24">
            <div className="max-w-lg mx-auto px-6 pt-8">
                <button onClick={() => setView('shop')} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6"><ChevronLeft size={20} /> Back</button>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{editProduct ? 'Edit Product' : 'Add Product'}</h2>
                <div className="space-y-4">
                    <input value={pName} onChange={e => setPName(e.target.value)} placeholder="Product Name" className="w-full bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-light/50" />
                    <textarea value={pDesc} onChange={e => setPDesc(e.target.value)} placeholder="Description" rows={3} className="w-full bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-light/50 resize-none" />
                    <input value={pPrice} onChange={e => setPPrice(e.target.value)} placeholder="Price" type="number" step="0.01" className="w-full bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-light/50" />
                    <select value={pCategory} onChange={e => setPCategory(e.target.value)} className="w-full bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 outline-none">
                        {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                    </select>
                    <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-6 text-center cursor-pointer hover:border-primary-light/50 transition-colors">
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => setPFile(e.target.files?.[0] || null)} />
                        <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500 text-sm">{pFile ? pFile.name : 'Upload product image'}</p>
                    </div>
                    <button onClick={saveProduct} disabled={saving || !pName || !pPrice} className="w-full bg-primary-light text-white py-3 rounded-2xl font-semibold disabled:opacity-50">
                        {saving ? 'Saving...' : editProduct ? 'Update Product' : 'Add Product'}
                    </button>
                </div>
            </div>
        </div>
    );

    if (view === 'checkout') return (
        <div className="h-full overflow-y-auto bg-surface-light dark:bg-surface-dark pb-24">
            <div className="max-w-lg mx-auto px-6 pt-8">
                <button onClick={() => setView('cart')} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6"><ChevronLeft size={20} /> Back</button>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Checkout</h2>
                <div className="bg-white dark:bg-[#1A1C1E] rounded-3xl p-6 shadow-sm mb-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">Shipping Details</h3>
                    <div className="space-y-3">
                        <input value={shipName} onChange={e => setShipName(e.target.value)} placeholder="Full Name" className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3 outline-none" />
                        <input value={shipAddress} onChange={e => setShipAddress(e.target.value)} placeholder="Address" className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3 outline-none" />
                        <div className="grid grid-cols-2 gap-3">
                            <input value={shipCity} onChange={e => setShipCity(e.target.value)} placeholder="City" className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3 outline-none" />
                            <input value={shipState} onChange={e => setShipState(e.target.value)} placeholder="State" className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3 outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <input value={shipZip} onChange={e => setShipZip(e.target.value)} placeholder="ZIP Code" className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3 outline-none" />
                            <input value={shipPhone} onChange={e => setShipPhone(e.target.value)} placeholder="Phone" className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3 outline-none" />
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-[#1A1C1E] rounded-3xl p-6 shadow-sm mb-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">Order Summary</h3>
                    {cart.map(ci => (
                        <div key={ci.product.id} className="flex justify-between py-2 text-sm">
                            <span className="text-gray-700 dark:text-gray-300">{ci.product.name} x{ci.quantity}</span>
                            <span className="font-medium">${(ci.product.price * ci.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="border-t border-gray-200 dark:border-gray-700 mt-3 pt-3 flex justify-between font-bold text-lg">
                        <span>Total</span><span>${cartTotal.toFixed(2)}</span>
                    </div>
                </div>
                <button onClick={placeOrder} disabled={saving || !shipName || !shipAddress} className="w-full bg-primary-light text-white py-4 rounded-2xl font-bold text-lg disabled:opacity-50">
                    {saving ? 'Placing Order...' : 'Place Order'}
                </button>
            </div>
        </div>
    );

    if (view === 'cart') return (
        <div className="h-full overflow-y-auto bg-surface-light dark:bg-surface-dark pb-24">
            <div className="max-w-lg mx-auto px-6 pt-8">
                <button onClick={() => setView('shop')} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6"><ChevronLeft size={20} /> Back</button>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Shopping Cart ({cartCount})</h2>
                {cart.length === 0 ? (
                    <div className="text-center py-16">
                        <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">Your cart is empty</p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {cart.map(ci => (
                                <div key={ci.product.id} className="bg-white dark:bg-[#1A1C1E] rounded-3xl p-4 shadow-sm flex gap-4">
                                    {ci.product.image_url ? (
                                        <img src={ci.product.image_url} className="w-20 h-20 rounded-2xl object-cover" alt="" />
                                    ) : (
                                        <div className="w-20 h-20 rounded-2xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl">📦</div>
                                    )}
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900 dark:text-white">{ci.product.name}</h4>
                                        <p className="text-primary-light font-bold">${ci.product.price.toFixed(2)}</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <button onClick={() => updateQty(ci.product.id, -1)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"><Minus size={14} /></button>
                                            <span className="font-medium w-6 text-center">{ci.quantity}</span>
                                            <button onClick={() => updateQty(ci.product.id, 1)} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"><Plus size={14} /></button>
                                            <button onClick={() => removeFromCart(ci.product.id)} className="ml-auto text-red-500"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 bg-white dark:bg-[#1A1C1E] rounded-3xl p-6 shadow-sm">
                            <div className="flex justify-between text-lg font-bold mb-4">
                                <span>Total</span><span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <button onClick={() => setView('checkout')} className="w-full bg-primary-light text-white py-3 rounded-2xl font-semibold">Proceed to Checkout</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );

    // SHOP VIEW
    return (
        <div className="h-full w-full bg-surface-light dark:bg-surface-dark overflow-y-auto pb-24">
            {/* Header */}
            <div className="px-6 pt-12 pb-4 sticky top-0 bg-surface-light dark:bg-surface-dark z-20 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-[32px] font-bold text-gray-900 dark:text-white tracking-tight">Store</h1>
                    <div className="flex gap-3">
                        <button onClick={() => openAdd()} className="w-10 h-10 rounded-full bg-primary-light text-white flex items-center justify-center"><Plus size={20} /></button>
                        <button onClick={() => setView('cart')} className="relative w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <ShoppingCart size={20} className="text-gray-700 dark:text-gray-300" />
                            {cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
                        </button>
                    </div>
                </div>
                <div className="relative mb-3">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full bg-gray-100 dark:bg-gray-800 rounded-full py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary-light/50" />
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {CATEGORIES.map(c => (
                        <button key={c} onClick={() => setCategory(c)}
                            className={classNames('px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all',
                                category === c ? 'bg-primary-light text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400')}>
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-4 md:px-6 py-4">
                {loading ? (
                    <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-primary-light border-t-transparent rounded-full animate-spin" /></div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <Package size={64} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400">No products found</h3>
                        <p className="text-gray-400 mt-2">Try a different search or add a product.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((p, i) => (
                            <div key={p.id} className="bg-white dark:bg-[#1A1C1E] rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 group hover:shadow-lg transition-all animate-in fade-in duration-300" style={{ animationDelay: `${i * 50}ms` }}>
                                <div className="h-48 overflow-hidden relative">
                                    {p.image_url ? (
                                        <img src={p.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-5xl">📦</div>
                                    )}
                                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-primary-light">${p.price.toFixed(2)}</div>
                                    {p.category && <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] text-white font-medium">{p.category}</div>}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{p.name}</h3>
                                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">{p.description}</p>
                                    <div className="flex gap-2">
                                        <button onClick={() => addToCart(p)} className="flex-1 bg-primary-light text-white py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg transition-all">Add to Cart</button>
                                        {p.user_id === user?.id && (
                                            <>
                                                <button onClick={() => openAdd(p)} className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600"><Edit size={16} /></button>
                                                <button onClick={() => deleteProduct(p.id)} className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500"><Trash2 size={16} /></button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PremiumStore;
