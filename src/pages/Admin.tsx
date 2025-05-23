import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Navigate } from 'react-router-dom';
import { NFT, Order } from '../types';
import {
    Hexagon,
    ShoppingCart,
    DollarSign,
    TrendingUp,
    Calendar,
    BarChart,
    LineChart,
    Plus,
    Edit,
    X,
    PackageX,
    Trash2,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
} from 'lucide-react';
import * as XLSX from 'xlsx';

const Dashboard: React.FC = () => {
    const { nfts, orders } = useStore();

    const totalNFTs = nfts.length;
    const totalNFTsSold = nfts.reduce((acc, nft) => acc + nft.soldCount, 0);
    const totalRevenue = nfts.reduce((acc, nft) => acc + nft.soldCount * nft.price, 0);
    const totalCancelledOrders = orders.filter((order) => order.status === 'cancelled').length;

    // Dummy data for monthly sales (replace with actual data)
    const monthlySalesData = [
        { month: 'Jan', sales: 50 },
        { month: 'Feb', sales: 80 },
        { month: 'Mar', sales: 70 },
        { month: 'Apr', sales: 100 },
        { month: 'May', sales: 120 },
    ];

    // Dummy data for daily sales (replace with actual data)
    const dailySalesData = [
        { day: 'Mon', sales: 10 },
        { day: 'Tue', sales: 15 },
        { day: 'Wed', sales: 13 },
        { day: 'Thu', sales: 18 },
        { day: 'Fri', sales: 20 },
    ];

    // Dummy data for cancelled orders (replace with actual data)
    const cancelledOrdersData = [
        { month: 'Jan', cancelled: 5 },
        { month: 'Feb', cancelled: 3 },
        { month: 'Mar', cancelled: 7 },
        { month: 'Apr', cancelled: 2 },
        { month: 'May', cancelled: 4 },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-xl p-6 shadow-md flex items-center space-x-4">
                <div className="p-4 bg-emerald-500 rounded-lg">
                    <Hexagon className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h4 className="text-gray-400 text-sm">Total NFTs</h4>
                    <p className="text-2xl font-bold text-white">{totalNFTs}</p>
                </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 shadow-md flex items-center space-x-4">
                <div className="p-4 bg-blue-500 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h4 className="text-gray-400 text-sm">Total NFTs Sold</h4>
                    <p className="text-2xl font-bold text-white">{totalNFTsSold}</p>
                </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 shadow-md flex items-center space-x-4">
                <div className="p-4 bg-yellow-500 rounded-lg">
                    <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                    <h4 className="text-gray-400 text-sm">Total Revenue</h4>
                    <p className="text-2xl font-bold text-white">{totalRevenue} MemeX</p>
                </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-gray-400" />
                    <span>Monthly Sales</span>
                </h3>
                <div className="h-40">
                    {/* Replace with actual chart component */}
                    <BarChart className="w-full h-full text-gray-400" />
                </div>
                <div className="flex justify-between text-gray-400 mt-2">
                    {monthlySalesData.map((item) => (
                        <div key={item.month} className="text-center">
                            <p className="text-xs">{item.month}</p>
                            <p className="text-sm">{item.sales}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span>Daily Sales</span>
                </h3>
                <div className="h-40">
                    {/* Replace with actual chart component */}
                    <LineChart className="w-full h-full text-gray-400" />
                </div>
                <div className="flex justify-between text-gray-400 mt-2">
                    {dailySalesData.map((item) => (
                        <div key={item.day} className="text-center">
                            <p className="text-xs">{item.day}</p>
                            <p className="text-sm">{item.sales}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                    <PackageX className="h-5 w-5 text-gray-400" />
                    <span>Cancelled Orders</span>
                </h3>
                <div className="h-40">
                    {/* Replace with actual chart component */}
                    <LineChart className="w-full h-full text-gray-400" />
                </div>
                <div className="flex justify-between text-gray-400 mt-2">
                    {cancelledOrdersData.map((item) => (
                        <div key={item.month} className="text-center">
                            <p className="text-xs">{item.month}</p>
                            <p className="text-sm">{item.cancelled}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const NFTProducts: React.FC = () => {
    const { nfts, updateNFT, deleteNFT } = useStore();
    const [editingNFTId, setEditingNFTId] = useState<string | null>(null);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [editedImage, setEditedImage] = useState('');
    const [editedPrice, setEditedPrice] = useState<number>(0);
    const [editedPriceXEP, setEditedPriceXEP] = useState<number>(0);
    const [editedMintCount, setEditedMintCount] = useState<number>(0);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const handleEditNFT = (nftId: string) => {
        setEditingNFTId(nftId);
        const nft = nfts.find((n) => n.id === nftId);
        if (nft) {
            setEditedTitle(nft.title);
            setEditedDescription(nft.description);
            setEditedImage(nft.image);
            setEditedPrice(nft.price);
            setEditedPriceXEP(nft.priceXEP || 0);
            setEditedMintCount(nft.mintCount);
        }
        setIsFullScreen(true);
    };

    const handleSaveNFT = (nftId: string) => {
        updateNFT(nftId, {
            title: editedTitle,
            description: editedDescription,
            image: editedImage,
            price: editedPrice,
            priceXEP: editedPriceXEP,
            mintCount: editedMintCount,
        });
        setEditingNFTId(null);
        setIsFullScreen(false);
    };

    const handleCancelEdit = () => {
        setEditingNFTId(null);
        setIsFullScreen(false);
    };

    const handleDeleteNFT = (nftId: string) => {
        deleteNFT(nftId);
    };

    return (
        <div className="bg-gray-800 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">NFT List</h3>
            <div className="space-y-4">
                {nfts.map((nft) => (
                    <div key={nft.id} className="flex items-center justify-between text-white">
                        {editingNFTId === nft.id ? (
                            <div className={`flex flex-col space-y-2 ${isFullScreen ? 'fixed top-0 left-0 w-full h-full bg-gray-900 z-50 p-8' : ''}`}>
                                {isFullScreen && (
                                    <button
                                        onClick={handleCancelEdit}
                                        className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-bold transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                                <input
                                    type="text"
                                    value={editedTitle}
                                    onChange={(e) => setEditedTitle(e.target.value)}
                                    className="bg-gray-700 text-white p-2 rounded-lg"
                                />
                                <textarea
                                    value={editedDescription}
                                    onChange={(e) => setEditedDescription(e.target.value)}
                                    className="bg-gray-700 text-white p-2 rounded-lg"
                                />
                                <input
                                    type="url"
                                    value={editedImage}
                                    onChange={(e) => setEditedImage(e.target.value)}
                                    className="bg-gray-700 text-white p-2 rounded-lg"
                                />
                                <input
                                    type="number"
                                    value={editedPrice}
                                    onChange={(e) => setEditedPrice(Number(e.target.value))}
                                    className="bg-gray-700 text-white p-2 rounded-lg"
                                />
                                <input
                                    type="number"
                                    value={editedPriceXEP}
                                    onChange={(e) => setEditedPriceXEP(Number(e.target.value))}
                                    className="bg-gray-700 text-white p-2 rounded-lg"
                                />
                                <input
                                    type="number"
                                    value={editedMintCount}
                                    onChange={(e) => setEditedMintCount(Number(e.target.value))}
                                    className="bg-gray-700 text-white p-2 rounded-lg"
                                />
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleSaveNFT(nft.id)}
                                        className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg font-bold transition-colors"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-bold transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <span>{nft.title}</span>
                                <div className="space-x-2">
                                    <button
                                        onClick={() => handleEditNFT(nft.id)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-bold transition-colors"
                                    >
                                        <Edit className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteNFT(nft.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-bold transition-colors"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const NFTOrders: React.FC = () => {
    const { orders, updateOrder, nfts, updatePendingBurn } = useStore();
    const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
    const [editedStatus, setEditedStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 100;

    // Calculate pagination
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    const handleEditOrder = (orderId: string) => {
        setEditingOrderId(orderId);
        const order = orders.find((o) => o.id === orderId);
        if (order) {
            setEditedStatus(order.status);
        }
    };

    const handleSaveOrder = (orderId: string) => {
        const order = orders.find((o) => o.id === orderId);
        if (!order) return;

        const nft = nfts.find((nft) => nft.title === order.nftTitle);
        if (!nft) return;

        const burnAmount = nft.price;

        updateOrder(orderId, { status: editedStatus });

        if (editedStatus === 'shipped') {
            updatePendingBurn(burnAmount);
        }

        setEditingOrderId(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'shipped':
                return 'bg-green-900/50';
            case 'pending payment':
                return 'bg-orange-900/50';
            case 'cancelled':
                return 'bg-red-900/50';
            default:
                return 'bg-gray-900/50';
        }
    };

    const handleTxHashClick = (txHash: string) => {
        window.open(`https://electraprotocol.network/omni/transaction/${txHash}`, '_blank');
    };

    return (
        <div className="bg-gray-800 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Orders</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            NFT Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Wallet Address
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            TX Hash
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Purchase Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                    {currentOrders.map((order) => (
                        <tr key={order.id} className={getStatusColor(order.status)}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.nftTitle}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.walletAddress}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {order.txHash ? (
                                    <button
                                        onClick={() => handleTxHashClick(order.txHash!)}
                                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                    >
                                        {order.txHash.substring(0, 8)}...
                                        <ExternalLink size={14} />
                                    </button>
                                ) : (
                                    <span className="text-gray-500">Not Provided</span>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.purchaseDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {editingOrderId === order.id ? (
                                    <select
                                        value={editedStatus}
                                        onChange={(e) => setEditedStatus(e.target.value)}
                                        className="bg-gray-700 text-white rounded-lg"
                                    >
                                        <option value="pending payment">Pending Payment</option>
                                        <option value="shipped">NFT Sent</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                ) : (
                                    order.status
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {editingOrderId === order.id ? (
                                    <button
                                        onClick={() => handleSaveOrder(order.id)}
                                        className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg font-bold transition-colors"
                                    >
                                        Save
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleEditOrder(order.id)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-bold transition-colors"
                                    >
                                        Edit
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4 text-white">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-lg ${
                                currentPage === 1 ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <span>
              Page {currentPage} of {totalPages}
            </span>
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`p-2 rounded-lg ${
                                currentPage === totalPages ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                            }`}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="text-sm text-gray-400">
                        Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, orders.length)} of {orders.length} orders
                    </div>
                </div>
            )}
        </div>
    );
};

const NFTEntry: React.FC = () => {
    const { addNFT } = useStore();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '',
        price: '',
        priceXEP: '',
        mintCount: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addNFT({
            title: formData.title,
            description: formData.description,
            image: formData.image,
            price: Number(formData.price),
            priceXEP: Number(formData.priceXEP),
            mintCount: Number(formData.mintCount),
            creator: 'Admin',
        });
        setFormData({ title: '', description: '', image: '', price: '', priceXEP: '', mintCount: '' });
    };

    return (
        <div className="bg-gray-800 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Add NFT</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-gray-400 mb-2">NFT Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-gray-700 text-white p-3 rounded-lg"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-400 mb-2">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-gray-700 text-white p-3 rounded-lg"
                        rows={4}
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-400 mb-2">Image URL</label>
                    <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        className="w-full bg-gray-700 text-white p-3 rounded-lg"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-400 mb-2">Price (MemeX)</label>
                    <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full bg-gray-700 text-white p-3 rounded-lg"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-400 mb-2">Price (XEP)</label>
                    <input
                        type="number"
                        value={formData.priceXEP}
                        onChange={(e) => setFormData({ ...formData, priceXEP: e.target.value })}
                        className="w-full bg-gray-700 text-white p-3 rounded-lg"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-400 mb-2">Mint Count</label>
                    <input
                        type="number"
                        value={formData.mintCount}
                        onChange={(e) => setFormData({ ...formData, mintCount: e.target.value })}
                        className="w-full bg-gray-700 text-white p-3 rounded-lg"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-bold transition-colors"
                >
                    Add NFT
                </button>
            </form>
        </div>
    );
};

const BurnManagement: React.FC = () => {
    const { burnedAmount, updateBurnedAmount } = useStore();
    const [localBurnedAmount, setLocalBurnedAmount] = useState<number>(burnedAmount);

    const handleBurnAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalBurnedAmount(Number(e.target.value));
    };

    const handleUpdateBurnedAmount = () => {
        updateBurnedAmount(localBurnedAmount);
    };

    return (
        <div className="bg-gray-800 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Burn Management</h3>
            <div>
                <label className="block text-gray-400 mb-2">Burned MemeX Amount</label>
                <input
                    type="number"
                    value={localBurnedAmount}
                    onChange={handleBurnAmountChange}
                    className="w-full bg-gray-700 text-white p-3 rounded-lg"
                />
            </div>
            <button
                onClick={handleUpdateBurnedAmount}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-bold transition-colors mt-4"
            >
                Update Burned Amount
            </button>
        </div>
    );
};

const ExportImport: React.FC = () => {
    const { nfts, orders, addNFT, updateNFT, deleteNFT } = useStore();
    const [selectedNftsFile, setSelectedNftsFile] = useState<File | null>(null);
    const [selectedOrdersFile, setSelectedOrdersFile] = useState<File | null>(null);
    const [nftsFile, setNftsFile] = useState<File | null>(null);
    const [ordersFile, setOrdersFile] = useState<File | null>(null);
    const [importProgress, setImportProgress] = useState<number>(0);
    const [isImporting, setIsImporting] = useState<boolean>(false);

    const exportToExcel = (dataType: 'nfts' | 'orders') => {
        let data: any[] = [];
        let fileName = '';

        if (dataType === 'nfts') {
            data = nfts.map((nft) => ({
                id: nft.id,
                title: nft.title,
                description: nft.description,
                image: nft.image,
                price: nft.price,
                priceXEP: nft.priceXEP,
                mintCount: nft.mintCount,
                soldCount: nft.soldCount,
                creator: nft.creator,
            }));
            fileName = 'nfts.xlsx';
        } else {
            data = orders.map((order) => ({
                id: order.id,
                nftTitle: order.nftTitle,
                customer: order.customer,
                walletAddress: order.walletAddress,
                purchaseDate: order.purchaseDate,
                status: order.status,
            }));
            fileName = 'orders.xlsx';
        }

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, dataType);
        XLSX.writeFile(wb, fileName);
    };

    const importFromExcel = (dataType: 'nfts' | 'orders', file: File | null) => {
        if (!file) {
            alert(`Please select a file to import ${dataType === 'nfts' ? 'NFTs' : 'Orders'}.`);
            return;
        }

        const reader = new FileReader();

        reader.onload = (e: any) => {
            const binarystr = e.target.result;
            const wb = XLSX.read(binarystr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const parsedData: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 });

            // Assuming the first row is the header
            const headers = parsedData[0] as string[];
            const rows = parsedData.slice(1) as any[][];
            const totalRows = rows.length;

            if (dataType === 'nfts') {
                // First, delete all existing NFTs
                nfts.forEach((nft) => deleteNFT(nft.id));

                rows.forEach((row, index) => {
                    const nftData: any = {};
                    headers.forEach((header, index) => {
                        nftData[header] = row[index];
                    });

                    // Add new NFT
                    addNFT({
                        title: nftData.title,
                        description: nftData.description,
                        image: nftData.image,
                        price: Number(nftData.price),
                        priceXEP: Number(nftData.priceXEP),
                        mintCount: Number(nftData.mintCount),
                        soldCount: Number(nftData.soldCount),
                        creator: nftData.creator,
                    });

                    const progress = Math.round(((index + 1) / totalRows) * 100);
                    setImportProgress(progress);
                });
                setImportProgress(100); // Ensure progress reaches 100%
                setIsImporting(false);
            } else {
                // Handle orders import
                // Similar logic asNFTs, but for orders
                // You'll need to adjust this part based on your order structure
                console.log('Importing orders:', parsedData);
            }
            setIsImporting(false);
        };

        reader.readAsBinaryString(file);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, dataType: 'nfts' | 'orders') => {
        const file = e.target.files?.[0];
        if (dataType === 'nfts') {
            setNftsFile(file);
            setSelectedNftsFile(file);
        } else {
            setOrdersFile(file);
            setSelectedOrdersFile(file);
        }
    };

    const handleImport = (dataType: 'nfts' |'orders') => {
        setIsImporting(true);
        setImportProgress(0);
        if (dataType === 'nfts') {
            importFromExcel('nfts', nftsFile);
        } else {
            importFromExcel('orders', ordersFile);
        }
    };

    return (
        <div className="bg-gray-800 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Export/Import Data</h3>
            <div className="flex space-x-4 mb-4">
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-bold transition-colors"
                    onClick={() => exportToExcel('nfts')}
                >
                    Export NFTs to Excel
                </button>
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-bold transition-colors"
                    onClick={() => exportToExcel('orders')}
                >
                    Export Orders to Excel
                </button>
            </div>

            <div className="flex space-x-4">
                <div>
                    <label className="block text-gray-400 mb-2">Import NFTs from Excel</label>
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={(e) => handleFileUpload(e, 'nfts')}
                        className="bg-gray-700 text-white p-2 rounded-lg"
                    />
                    <button
                        className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg font-bold transition-colors mt-2"
                        onClick={() => handleImport('nfts')}
                        disabled={isImporting}
                    >
                        Import NFTs
                    </button>
                </div>
                <div>
                    <label className="block text-gray-400 mb-2">Import Orders from Excel</label>
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={(e) => handleFileUpload(e, 'orders')}
                        className="bg-gray-700 text-white p-2 rounded-lg"
                    />
                    <button
                        className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg font-bold transition-colors mt-2"
                        onClick={() => handleImport('orders')}
                        disabled={isImporting}
                    >
                        Import Orders
                    </button>
                </div>
            </div>
            {isImporting && (
                <div className="mt-4">
                    <p className="text-white">Importing... {importProgress}%</p>
                    <progress value={importProgress} max="100" className="w-full"></progress>
                </div>
            )}
        </div>
    );
};

const Admin:React.FC = () => {
    const { isAuthenticated, pendingBurn, burnedAmount } = useStore();
    const [activeTab, setActiveTab] = useState('dashboard');

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="min-h-screen bg-gray-900 py-6">
            <div className="container mx-auto px-6 max-w-6xl">
                <h2 className="text-3xl font-bold text-white mb-8">Admin Panel</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-800 rounded-xl p-6 shadow-md">
                        <h4 className="text-gray-400 text-sm">MemeX Pending Burn</h4>
                        <p className="text-2xl font-bold text-white">{pendingBurn.toLocaleString('tr-TR')}</p>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-6 shadow-md">
                        <h4 className="text-gray-400 text-sm">MemeX Burned</h4>
                        <p className="text-2xl font-bold text-white">{burnedAmount.toLocaleString('tr-TR')}</p>
                    </div>
                </div>

                <div className="flex space-x-4 mb-8">
                    <button
                        className={`bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg ${
                            activeTab === 'dashboard' ? 'bg-gray-700' : ''
                        }`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        Dashboard
                    </button>
                    <button
                        className={`bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg ${
                            activeTab === 'nftProducts' ? 'bg-gray-700' : ''
                        }`}
                        onClick={() => setActiveTab('nftProducts')}
                    >
                        NFT Products
                    </button>
                    <button
                        className={`bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg ${
                            activeTab === 'nftOrders' ? 'bg-gray-700' : ''
                        }`}
                        onClick={() => setActiveTab('nftOrders')}
                    >
                        NFT Orders
                    </button>
                    <button
                        className={`bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg ${
                            activeTab === 'nftEntry' ? 'bg-gray-700' : ''
                        }`}
                        onClick={() => setActiveTab('nftEntry')}
                    >
                        NFT Entry
                    </button>
                    <button
                        className={`bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg ${
                            activeTab === 'burnManagement' ? 'bg-gray-700' : ''
                        }`}
                        onClick={() => setActiveTab('burnManagement')}
                    >
                        Burn Management          </button>
                    <button
                        className={`bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg ${
                            activeTab === 'exportImport' ? 'bg-gray-700' : ''
                        }`}
                        onClick={() => setActiveTab('exportImport')}
                    >
                        Export / Import
                    </button>
                </div>

                {activeTab === 'dashboard' && <Dashboard />}
                {activeTab === 'nftProducts' && <NFTProducts />}
                {activeTab === 'nftOrders' && <NFTOrders />}
                {activeTab === 'nftEntry' && <NFTEntry />}
                {activeTab === 'burnManagement' && <BurnManagement />}
                {activeTab === 'exportImport' && <ExportImport />}
            </div>
        </div>
    );
};

export default Admin;
export { Admin };