import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChefHat, 
  LogOut, 
  Pizza, 
  ShoppingCart, 
  TrendingUp,
  Package,
  Users,
  DollarSign,
  ImagePlus,
  Upload,
  Truck,
  Check,
  Clock,
  MapPin,
  Settings,
  Edit,
  Trash2,
  Filter,
  Image,
  FileText,
  Tag,
  Star,
  Download,
  Plus,
  X,
  Save,
  RefreshCw,
  Home
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { MenuItem, GalleryImage, Coupon, InsertCoupon, Review, InsertReview } from "@shared/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import QRCodeGenerator from "@/components/QRCodeGenerator";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [orderingEnabled, setOrderingEnabled] = useState(true);
  const queryClient = useQueryClient();
  
  // Menu Management State
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [menuFormData, setMenuFormData] = useState({
    name: "",
    description: "",
    category: "pizza" as "pizza" | "pasta" | "salad" | "breakfast" | "sandwich" | "main_course" | "side" | "coffee" | "drink" | "juice" | "fresh_juice" | "beer" | "wine" | "alcohol",
    price: "",
    sizes: [] as Array<{ name: string; price: string }>,
    imageUrl: "",
    available: true,
    featured: false,
    isNew: false,
  });

  // Gallery Management State
  const [isGalleryDialogOpen, setIsGalleryDialogOpen] = useState(false);
  const [galleryFormData, setGalleryFormData] = useState({
    imageUrl: "",
    altText: "",
    displayOrder: "",
  });

  // Site Content Management State
  const [siteContent, setSiteContent] = useState<Map<string, string>>(new Map());
  const [siteContentForm, setSiteContentForm] = useState<Record<string, string>>({});
  const [isSavingSiteContent, setIsSavingSiteContent] = useState(false);

  // Coupons Management State
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isCouponDialogOpen, setIsCouponDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [couponFormData, setCouponFormData] = useState({
    code: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: "",
    minOrder: "",
    maxUses: "",
    expiresAt: "",
    isActive: true,
  });

  // Reviews Management State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pendingReviewsCount, setPendingReviewsCount] = useState(0);
  const [reviewsFilter, setReviewsFilter] = useState<"all" | "approved" | "pending">("all");

  // Analytics State
  const [analytics, setAnalytics] = useState<any>(null);

  // Users Management State
  const [users, setUsers] = useState<Array<{ id: string; username: string }>>([]);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [userFormData, setUserFormData] = useState({
    username: "",
    password: "",
  });

  // Gallery queries and mutations
  const { data: galleryData } = useQuery<{ success: boolean; images: GalleryImage[] }>({
    queryKey: ["/api/gallery-images"],
  });

  const deleteGalleryMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/gallery-images/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete image");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery-images"] });
      toast.success("Slika obrisana iz galerije!");
    },
    onError: () => {
      toast.error("Greška pri brisanju slike");
    },
  });

  const addGalleryMutation = useMutation({
    mutationFn: async (data: { imageUrl: string; altText: string; displayOrder: number }) => {
      const response = await fetch("/api/gallery-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to add image");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gallery-images"] });
      toast.success("Slika dodata u galeriju!");
      setIsGalleryDialogOpen(false);
      setGalleryFormData({ imageUrl: "", altText: "", displayOrder: "" });
    },
    onError: () => {
      toast.error("Greška pri dodavanju slike");
    },
  });

  const galleryImages = galleryData?.images || [];

  const handleAddGalleryImage = async () => {
    if (!galleryFormData.imageUrl || !galleryFormData.altText) {
      toast.error("Molim popunite sva polja");
      return;
    }

    addGalleryMutation.mutate({
      imageUrl: galleryFormData.imageUrl,
      altText: galleryFormData.altText,
      displayOrder: parseInt(galleryFormData.displayOrder) || 0,
    });
  };

  const handleDeleteGalleryImage = (id: number) => {
    if (confirm("Da li ste sigurni da želite da obrišete ovu sliku?")) {
      deleteGalleryMutation.mutate(id);
    }
  };

  const [woltOrders, setWoltOrders] = useState([
    {
      id: "wolt_001",
      orderNumber: "#W-4521",
      customerName: "Marko P.",
      items: [
        { name: "Margherita", count: 2, options: ["Extra cheese", "Thin crust"], price: "2200 RSD" },
        { name: "Coca Cola 0.5L", count: 2, options: [], price: "600 RSD" }
      ],
      total: "2800 RSD",
      deliveryFee: "200 RSD",
      deliveryAddress: "Bulevar kralja Aleksandra 73, Beograd",
      status: "received",
      createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
      pickupEta: new Date(Date.now() + 20 * 60000).toISOString(),
    },
    {
      id: "wolt_002",
      orderNumber: "#W-4522",
      customerName: "Ana J.",
      items: [
        { name: "Pepperoni", count: 1, options: ["Extra pepperoni"], price: "1400 RSD" },
        { name: "Quattro Formaggi", count: 1, options: [], price: "1600 RSD" },
        { name: "Tiramisu", count: 2, options: [], price: "1200 RSD" }
      ],
      total: "4200 RSD",
      deliveryFee: "250 RSD",
      deliveryAddress: "Kneza Miloša 45, Beograd",
      status: "acknowledged",
      createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
      pickupEta: new Date(Date.now() + 10 * 60000).toISOString(),
    },
    {
      id: "wolt_003",
      orderNumber: "#W-4520",
      customerName: "Stefan N.",
      items: [
        { name: "Vegetariana", count: 1, options: ["No onions"], price: "1100 RSD" },
        { name: "Sprite 0.5L", count: 1, options: [], price: "300 RSD" }
      ],
      total: "1400 RSD",
      deliveryFee: "200 RSD",
      deliveryAddress: "Takovska 15, Beograd",
      status: "ready",
      createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
      pickupEta: new Date(Date.now() - 5 * 60000).toISOString(),
    },
  ]);

  useEffect(() => {
    const userData = localStorage.getItem("adminUser");
    if (!userData) {
      setLocation("/admin");
      return;
    }
    setUser(JSON.parse(userData));
    
    // Load ordering status
    fetch("/api/settings/ordering-enabled")
      .then(res => res.json())
      .then(data => setOrderingEnabled(data.orderingEnabled))
      .catch(() => setOrderingEnabled(true));

    // Load menu items
    loadMenuItems();
    
    // Load site content
    loadSiteContent();
  }, [setLocation]);

  // Filter items by category
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredItems(menuItems);
    } else if (selectedCategory === "featured") {
      setFilteredItems(menuItems.filter(item => item.featured === true));
    } else if (selectedCategory === "new") {
      setFilteredItems(menuItems.filter(item => item.isNew === true));
    } else {
      setFilteredItems(menuItems.filter(item => item.category === selectedCategory));
    }
  }, [menuItems, selectedCategory]);

  const loadMenuItems = async () => {
    try {
      const response = await fetch("/api/menu-items");
      const data = await response.json();
      if (data.success) {
        setMenuItems(data.items);
      }
    } catch (error) {
      toast.error("Greška pri učitavanju stavki jelovnika");
    }
  };

  const loadSiteContent = async () => {
    try {
      const response = await fetch("/api/site-content");
      const data = await response.json();
      if (data.success) {
        setSiteContent(new Map(Object.entries(data.content)));
        setSiteContentForm(data.content);
      }
    } catch (error) {
      toast.error("Greška pri učitavanju sadržaja sajta");
    }
  };

  const handleSiteContentChange = (key: string, value: string) => {
    setSiteContentForm(prev => ({ ...prev, [key]: value }));
  };

  const updateSiteContentField = async (key: string, value: string) => {
    setIsSavingSiteContent(true);
    try {
      const response = await fetch(`/api/site-content/${key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setSiteContent(prev => new Map(prev).set(key, value));
        toast.success("Sadržaj ažuriran!");
      } else {
        toast.error("Greška pri ažuriranju");
      }
    } catch (error) {
      toast.error("Greška pri komunikaciji sa serverom");
    } finally {
      setIsSavingSiteContent(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    setLocation("/admin");
  };

  const handleToggleOrdering = async (enabled: boolean) => {
    try {
      const response = await fetch("/api/settings/ordering-enabled", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      });
      const data = await response.json();
      if (data.success) {
        setOrderingEnabled(enabled);
        toast.success(enabled ? "Naručivanje je uključeno" : "Naručivanje je isključeno");
      } else {
        toast.error("Greška pri ažuriranju");
      }
    } catch (error) {
      toast.error("Greška pri komunikaciji sa serverom");
    }
  };

  // Menu Management Functions
  const openAddDialog = () => {
    setEditingMenuItem(null);
    setMenuFormData({
      name: "",
      description: "",
      category: "pizza",
      price: "",
      sizes: [],
      imageUrl: "",
      available: true,
      featured: false,
      isNew: false,
    });
    setIsMenuDialogOpen(true);
  };

  const openEditDialog = (item: MenuItem) => {
    setEditingMenuItem(item);
    
    // Parse sizes from JSON string or use legacy price32/price42
    let parsedSizes: Array<{ name: string; price: string }> = [];
    if (item.sizes) {
      try {
        const sizesData = typeof item.sizes === 'string' ? JSON.parse(item.sizes) : item.sizes;
        parsedSizes = sizesData.map((s: any) => ({ name: s.name, price: s.price.toString() }));
      } catch (e) {
        console.error('Error parsing sizes:', e);
      }
    } else if (item.price32 || item.price42) {
      // Legacy support: convert price32/price42 to sizes
      if (item.price32) parsedSizes.push({ name: "32cm", price: item.price32.toString() });
      if (item.price42) parsedSizes.push({ name: "42cm", price: item.price42.toString() });
    }
    
    setMenuFormData({
      name: item.name,
      description: item.description,
      category: item.category as "pizza" | "pasta" | "salad" | "drink",
      price: item.price?.toString() || "",
      sizes: parsedSizes,
      imageUrl: item.imageUrl || "",
      available: item.available,
      featured: item.featured || false,
      isNew: item.isNew || false,
    });
    setIsMenuDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setMenuFormData({ ...menuFormData, imageUrl: data.imageUrl });
        toast.success("Slika je uspešno upload-ovana");
      } else {
        toast.error(data.message || "Greška pri upload-u slike");
      }
    } catch (error) {
      toast.error("Greška pri upload-u slike");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveMenuItem = async () => {
    // Validation
    if (!menuFormData.name || !menuFormData.description) {
      toast.error("Naziv i opis su obavezni");
      return;
    }

    // Check if has sizes or price
    const hasSizes = menuFormData.sizes.length > 0;
    const hasPrice = menuFormData.price && menuFormData.price.trim() !== "";

    if (!hasSizes && !hasPrice) {
      toast.error("Morate uneti ili cenu ili veličine");
      return;
    }

    if (hasSizes && hasPrice) {
      toast.error("Ne možete imati i cenu i veličine - izaberite jedno");
      return;
    }

    // Validate sizes if present
    if (hasSizes) {
      for (let i = 0; i < menuFormData.sizes.length; i++) {
        const size = menuFormData.sizes[i];
        if (!size.name || !size.price) {
          toast.error(`Veličina ${i + 1}: Naziv i cena su obavezni`);
          return;
        }
        if (isNaN(parseInt(size.price)) || parseInt(size.price) <= 0) {
          toast.error(`Veličina ${i + 1}: Cena mora biti pozitivan broj`);
          return;
        }
      }
    }

    const payload: any = {
      name: menuFormData.name,
      description: menuFormData.description,
      category: menuFormData.category,
      imageUrl: menuFormData.imageUrl || null,
      available: menuFormData.available,
      featured: menuFormData.featured,
      isNew: menuFormData.isNew,
    };

    if (hasSizes) {
      // Convert sizes to JSON string with integer prices
      const sizesData = menuFormData.sizes.map(s => ({
        name: s.name,
        price: parseInt(s.price)
      }));
      payload.sizes = JSON.stringify(sizesData);
      payload.price = null;
      payload.price32 = null;
      payload.price42 = null;
    } else {
      // Regular price
      payload.price = parseInt(menuFormData.price);
      payload.sizes = null;
      payload.price32 = null;
      payload.price42 = null;
    }

    try {
      let response;
      if (editingMenuItem) {
        // Update existing item
        response = await fetch(`/api/menu-items/${editingMenuItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new item
        response = await fetch("/api/menu-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        setIsMenuDialogOpen(false);
        loadMenuItems();
      } else {
        toast.error(data.message || "Greška pri čuvanju stavke");
      }
    } catch (error) {
      toast.error("Greška pri komunikaciji sa serverom");
    }
  };

  const handleDeleteMenuItem = async (id: number, name: string) => {
    if (!confirm(`Da li ste sigurni da želite da obrišete "${name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/menu-items/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        loadMenuItems();
      } else {
        toast.error(data.message || "Greška pri brisanju stavke");
      }
    } catch (error) {
      toast.error("Greška pri komunikaciji sa serverom");
    }
  };

  // Coupons Management Functions
  const loadCoupons = async () => {
    try {
      const response = await fetch("/api/coupons", {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setCoupons(data.coupons);
      }
    } catch (error) {
      toast.error("Greška pri učitavanju kupona");
    }
  };

  const openAddCouponDialog = () => {
    setEditingCoupon(null);
    setCouponFormData({
      code: "",
      discountType: "percentage",
      discountValue: "",
      minOrder: "",
      maxUses: "",
      expiresAt: "",
      isActive: true,
    });
    setIsCouponDialogOpen(true);
  };

  const openEditCouponDialog = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCouponFormData({
      code: coupon.code,
      discountType: coupon.discountType as "percentage" | "fixed",
      discountValue: coupon.discountValue.toString(),
      minOrder: coupon.minOrder?.toString() || "",
      maxUses: coupon.maxUses?.toString() || "",
      expiresAt: coupon.expiresAt ? new Date(coupon.expiresAt).toISOString().slice(0, 16) : "",
      isActive: coupon.isActive,
    });
    setIsCouponDialogOpen(true);
  };

  const handleSaveCoupon = async () => {
    if (!couponFormData.code || !couponFormData.discountValue) {
      toast.error("Kod i vrednost popusta su obavezni");
      return;
    }

    const payload: any = {
      code: couponFormData.code.toUpperCase(),
      discountType: couponFormData.discountType,
      discountValue: parseInt(couponFormData.discountValue),
      minOrder: couponFormData.minOrder ? parseInt(couponFormData.minOrder) : null,
      maxUses: couponFormData.maxUses ? parseInt(couponFormData.maxUses) : null,
      expiresAt: couponFormData.expiresAt ? new Date(couponFormData.expiresAt).toISOString() : null,
      isActive: couponFormData.isActive,
    };

    try {
      let response;
      if (editingCoupon) {
        response = await fetch(`/api/coupons/${editingCoupon.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        });
      } else {
        response = await fetch("/api/coupons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          credentials: "include",
        });
      }

      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        setIsCouponDialogOpen(false);
        loadCoupons();
      } else {
        toast.error(data.message || "Greška pri čuvanju kupona");
      }
    } catch (error) {
      toast.error("Greška pri komunikaciji sa serverom");
    }
  };

  const handleDeleteCoupon = async (id: number, code: string) => {
    if (!confirm(`Da li ste sigurni da želite da obrišete kupon "${code}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/coupons/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        loadCoupons();
      } else {
        toast.error(data.message || "Greška pri brisanju kupona");
      }
    } catch (error) {
      toast.error("Greška pri komunikaciji sa serverom");
    }
  };

  // Reviews Management Functions
  const loadReviews = async () => {
    try {
      const response = await fetch("/api/reviews", {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setReviews(data.reviews);
        const pending = data.reviews.filter((r: Review) => !r.isApproved).length;
        setPendingReviewsCount(pending);
      }
    } catch (error) {
      toast.error("Greška pri učitavanju recenzija");
    }
  };

  const handleApproveReview = async (id: number) => {
    try {
      const response = await fetch(`/api/reviews/${id}/approve`, {
        method: "PUT",
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        loadReviews();
      } else {
        toast.error(data.message || "Greška pri odobravanju recenzije");
      }
    } catch (error) {
      toast.error("Greška pri komunikaciji sa serverom");
    }
  };

  const handleDeleteReview = async (id: number) => {
    if (!confirm("Da li ste sigurni da želite da obrišete ovu recenziju?")) {
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        loadReviews();
      } else {
        toast.error(data.message || "Greška pri brisanju recenzije");
      }
    } catch (error) {
      toast.error("Greška pri komunikaciji sa serverom");
    }
  };

  // Analytics Functions
  const loadAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics", {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      toast.error("Greška pri učitavanju statistike");
    }
  };

  // Backup Functions
  const handleDownloadBackup = async () => {
    try {
      const response = await fetch("/api/backup/export", {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        const blob = new Blob([JSON.stringify(data.backup, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `backup-${data.timestamp.replace(/:/g, "-")}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Backup uspešno preuzet!");
      } else {
        toast.error("Greška pri kreiranju backup-a");
      }
    } catch (error) {
      toast.error("Greška pri komunikaciji sa serverom");
    }
  };

  // Users Management Functions
  const loadUsers = async () => {
    try {
      const response = await fetch("/api/users", {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      toast.error("Greška pri učitavanju korisnika");
    }
  };

  const handleCreateUser = async () => {
    if (!userFormData.username || !userFormData.password) {
      toast.error("Korisničko ime i lozinka su obavezni");
      return;
    }

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userFormData),
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        setIsUserDialogOpen(false);
        setUserFormData({ username: "", password: "" });
        loadUsers();
      } else {
        toast.error(data.message || "Greška pri kreiranju korisnika");
      }
    } catch (error) {
      toast.error("Greška pri komunikaciji sa serverom");
    }
  };

  // Load coupons, reviews, analytics and users after component mount
  useEffect(() => {
    if (user) {
      loadCoupons();
      loadReviews();
      loadAnalytics();
      loadUsers();
    }
  }, [user]);

  const handleWoltOrderAction = (orderId: string, newStatus: string) => {
    setWoltOrders(woltOrders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));

    const statusMessages: Record<string, string> = {
      "acknowledged": "Narudžbina prihvaćena - priprema može da počne",
      "ready": "Narudžbina spremna za preuzimanje"
    };

    toast.success(statusMessages[newStatus] || "Status narudžbine je ažuriran");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "received":
        return "border-blue-500 text-blue-500";
      case "acknowledged":
        return "border-yellow-500 text-yellow-500";
      case "ready":
        return "border-green-500 text-green-500";
      default:
        return "border-white/50 text-white/50";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "received":
        return "Nova narudžbina";
      case "acknowledged":
        return "Prihvaćena - Priprema";
      case "ready":
        return "Spremna za kurira";
      default:
        return status;
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' });
  };

  if (!user) {
    return null;
  }

  const stats = [
    { title: "Ukupne narudžbine", value: "24", icon: ShoppingCart, color: "text-primary" },
    { title: "Aktivne narudžbine", value: "5", icon: Package, color: "text-secondary" },
    { title: "Proizvodi u meniju", value: "12", icon: Pizza, color: "text-green-500" },
    { title: "Prihod danas", value: "45000 RSD", icon: DollarSign, color: "text-yellow-500" },
  ];

  return (
    <div className="min-h-screen bg-background cursor-none">
      {/* Header */}
      <header className="border-b border-white/10 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <img 
              src="/logo.png" 
              alt="La Tavernetta" 
              className="h-10 md:h-12"
            />
            <div>
              <h1 className="text-base md:text-xl font-display font-semibold">
                Admin Panel
              </h1>
              <p className="text-xs md:text-sm text-white/60">La Tavernetta</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm text-white/60">Prijavljeni kao</p>
              <p className="font-semibold">{user.username}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => setLocation("/")}
              className="border-white/20 hover:bg-primary/10 cursor-pointer text-xs md:text-sm px-2 md:px-4"
            >
              <Home className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Nazad na Sajt</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-white/20 hover:bg-primary/10 cursor-pointer text-xs md:text-sm px-2 md:px-4"
            >
              <LogOut className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Odjavi se</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-background/50 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-background/50 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="wolt">
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
            <TabsList className="bg-background/50 border border-white/10 inline-flex w-auto">
              <TabsTrigger value="wolt" className="cursor-pointer whitespace-nowrap text-xs sm:text-sm">
                <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Narudžbine</span>
                <span className="sm:hidden">Orders</span>
              </TabsTrigger>
              <TabsTrigger value="menu" className="cursor-pointer whitespace-nowrap text-xs sm:text-sm">
                <Pizza className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Meni
              </TabsTrigger>
              <TabsTrigger value="gallery" className="cursor-pointer whitespace-nowrap text-xs sm:text-sm">
                <Image className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Galerija</span>
                <span className="sm:hidden">Gallery</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="cursor-pointer whitespace-nowrap text-xs sm:text-sm">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Analitika</span>
                <span className="sm:hidden">Stats</span>
              </TabsTrigger>
              <TabsTrigger value="coupons" className="cursor-pointer whitespace-nowrap text-xs sm:text-sm">
                <Tag className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Promocije</span>
                <span className="sm:hidden">Coupons</span>
              </TabsTrigger>
              <TabsTrigger value="reviews" className="cursor-pointer whitespace-nowrap text-xs sm:text-sm">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                {pendingReviewsCount > 0 && (
                  <Badge className="ml-1 bg-red-500 text-white text-[10px] px-1 min-w-[16px] h-[16px]">
                    {pendingReviewsCount}
                  </Badge>
                )}
                <span className="hidden sm:inline">Recenzije</span>
                <span className="sm:hidden">Reviews</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="cursor-pointer whitespace-nowrap text-xs sm:text-sm">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Korisnici</span>
                <span className="sm:hidden">Users</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="cursor-pointer whitespace-nowrap text-xs sm:text-sm">
                <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Sadržaj</span>
                <span className="sm:hidden">Content</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="cursor-pointer whitespace-nowrap text-xs sm:text-sm">
                <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Postavke</span>
                <span className="sm:hidden">Setup</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="wolt" className="mt-6">
            <Card className="bg-background/50 border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-primary" />
                    Narudžbine
                  </CardTitle>
                  <Badge className="bg-gradient-to-r from-cyan-600 to-blue-600">
                    {woltOrders.filter(o => o.status !== "delivered").length} Aktivne
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {woltOrders.map((order) => (
                    <Card key={order.id} className="bg-background/30 border-white/10">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Header sa ID i statusom */}
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold font-display">{order.orderNumber}</h3>
                                <Badge variant="outline" className={getStatusColor(order.status)}>
                                  {getStatusLabel(order.status)}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-white/60">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>Naručeno: {formatTime(order.createdAt)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Truck className="w-4 h-4" />
                                  <span>Preuzimanje: {formatTime(order.pickupEta)}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-primary">{order.total}</p>
                              <p className="text-xs text-white/60">Dostava: {order.deliveryFee}</p>
                            </div>
                          </div>

                          {/* Kupac i adresa */}
                          <div className="flex items-start gap-2 p-3 rounded-lg bg-background/40">
                            <MapPin className="w-4 h-4 text-secondary mt-1 shrink-0" />
                            <div>
                              <p className="font-semibold">{order.customerName}</p>
                              <p className="text-sm text-white/70">{order.deliveryAddress}</p>
                            </div>
                          </div>

                          {/* Stavke */}
                          <div className="space-y-2">
                            <p className="text-sm font-semibold text-white/80">Stavke:</p>
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-start p-3 rounded-lg bg-background/40">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold">{item.count}x</span>
                                    <span>{item.name}</span>
                                  </div>
                                  {item.options.length > 0 && (
                                    <p className="text-xs text-white/60 ml-6 mt-1">
                                      + {item.options.join(", ")}
                                    </p>
                                  )}
                                </div>
                                <span className="text-sm font-semibold text-white/80">{item.price}</span>
                              </div>
                            ))}
                          </div>

                          {/* Akcije */}
                          <div className="flex gap-2 pt-4 border-t border-white/10">
                            {order.status === "received" && (
                              <Button
                                onClick={() => handleWoltOrderAction(order.id, "acknowledged")}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 cursor-pointer"
                              >
                                <Check className="w-4 h-4 mr-2" />
                                Prihvati narudžbinu
                              </Button>
                            )}
                            {order.status === "acknowledged" && (
                              <Button
                                onClick={() => handleWoltOrderAction(order.id, "ready")}
                                className="flex-1 bg-green-600 hover:bg-green-700 cursor-pointer"
                              >
                                <Package className="w-4 h-4 mr-2" />
                                Označi kao spremno
                              </Button>
                            )}
                            {order.status === "ready" && (
                              <div className="flex-1 text-center p-3 rounded-lg bg-green-800/30 text-green-400 border border-green-500/30">
                                <Clock className="w-4 h-4 inline mr-2" />
                                Čeka Wolt kurira
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {woltOrders.filter(o => o.status !== "ready").length === 0 && woltOrders.length > 0 && (
                    <div className="text-center py-8 text-white/60 bg-background/20 rounded-lg border border-white/10">
                      <Check className="w-12 h-12 mx-auto mb-4 text-green-500" />
                      <p className="text-lg font-semibold">Sve narudžbine su spremne!</p>
                      <p className="text-sm mt-2">Čekaju Wolt kurir za preuzimanje</p>
                    </div>
                  )}
                  {woltOrders.length === 0 && (
                    <div className="text-center py-12 text-white/40">
                      <Truck className="w-12 h-12 mx-auto mb-4 opacity-40" />
                      <p className="text-lg font-semibold">Nema aktivnih Wolt narudžbina</p>
                      <p className="text-sm mt-2">Nova narudžbina će se automatski pojaviti ovde</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menu" className="mt-6">
            <Card className="bg-background/50 border-white/10">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Pizza className="w-5 h-5" />
                    Upravljanje Jelovnikom
                  </CardTitle>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full sm:w-[180px] bg-background/50 border-white/20 cursor-pointer">
                        <SelectValue placeholder="Filter po kategoriji" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-white/10">
                        <SelectItem value="all" className="cursor-pointer">Sve kategorije</SelectItem>
                        <SelectItem value="featured" className="cursor-pointer">⭐ Istaknuto</SelectItem>
                        <SelectItem value="new" className="cursor-pointer">🆕 Novo</SelectItem>
                        <SelectItem value="pizza" className="cursor-pointer">🍕 Pizze</SelectItem>
                        <SelectItem value="pasta" className="cursor-pointer">🍝 Paste</SelectItem>
                        <SelectItem value="salad" className="cursor-pointer">🥗 Salate</SelectItem>
                        <SelectItem value="side" className="cursor-pointer">🍟 Dodaci</SelectItem>
                        <SelectItem value="breakfast" className="cursor-pointer">🍳 Doručak</SelectItem>
                        <SelectItem value="sandwich" className="cursor-pointer">🥪 Sendviči</SelectItem>
                        <SelectItem value="main_course" className="cursor-pointer">🍖 Glavna Jela</SelectItem>
                        <SelectItem value="coffee" className="cursor-pointer">☕ Kafa</SelectItem>
                        <SelectItem value="drink" className="cursor-pointer">🥤 Voda</SelectItem>
                        <SelectItem value="juice" className="cursor-pointer">🧃 Sokovi</SelectItem>
                        <SelectItem value="fresh_juice" className="cursor-pointer">🍊 Fresh Sokovi</SelectItem>
                        <SelectItem value="beer" className="cursor-pointer">🍺 Pivo</SelectItem>
                        <SelectItem value="wine" className="cursor-pointer">🍷 Vino</SelectItem>
                        <SelectItem value="alcohol" className="cursor-pointer">🥃 Žestoka Pića</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={openAddDialog} className="bg-primary hover:bg-primary/90 cursor-pointer">
                      <ImagePlus className="w-4 h-4 mr-2" />
                      Dodaj Stavku
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredItems.length === 0 ? (
                  <div className="text-center py-12 text-white/40">
                    <Pizza className="w-12 h-12 mx-auto mb-4 opacity-40" />
                    <p className="text-lg font-semibold">Nema stavki u jelovniku</p>
                    <p className="text-sm mt-2">Dodajte nove stavke koristeći dugme "Dodaj Stavku"</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-lg bg-background/30 border border-white/10 relative overflow-hidden"
                      >
                        {item.imageUrl && (
                          <div className="w-full h-32 mb-3 rounded-lg overflow-hidden">
                            <img 
                              src={item.imageUrl} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex gap-1 flex-wrap justify-end max-w-[70%]">
                          <Badge className="text-xs capitalize">
                            {item.category}
                          </Badge>
                          {!item.available && (
                            <Badge variant="destructive" className="text-xs">
                              Nedostupno
                            </Badge>
                          )}
                          {item.featured && (
                            <Badge className="text-xs bg-yellow-500 text-black">
                              ⭐ Istaknuto
                            </Badge>
                          )}
                          {item.isNew && (
                            <Badge className="text-xs bg-green-500 text-white">
                              🆕 NOVO
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                        <p className="text-sm text-white/60 mb-2 line-clamp-2">{item.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="text-primary font-bold text-base">
                            {(() => {
                              // Parse sizes if available
                              if (item.sizes) {
                                try {
                                  const parsedSizes = typeof item.sizes === 'string' ? JSON.parse(item.sizes) : item.sizes;
                                  return (
                                    <div className="flex flex-col gap-0.5">
                                      {parsedSizes.map((size: any, idx: number) => (
                                        <span key={idx} className="text-xs text-white/60">
                                          {size.name}: {size.price} RSD
                                        </span>
                                      ))}
                                    </div>
                                  );
                                } catch (e) {
                                  return <span className="text-xs text-red-400">Greška u podacima</span>;
                                }
                              }
                              // Legacy: show price32/price42
                              if (item.price32 || item.price42) {
                                return (
                                  <div className="flex flex-col gap-0.5">
                                    {item.price32 && <span className="text-xs text-white/60">32cm: {item.price32} RSD</span>}
                                    {item.price42 && <span className="text-xs text-white/60">42cm: {item.price42} RSD</span>}
                                  </div>
                                );
                              }
                              // Regular price
                              return <span>{item.price} RSD</span>;
                            })()}
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => openEditDialog(item)}
                              className="cursor-pointer"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleDeleteMenuItem(item.id, item.name)}
                              className="cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Menu Item Dialog */}
            <Dialog open={isMenuDialogOpen} onOpenChange={setIsMenuDialogOpen}>
              <DialogContent className="sm:max-w-[600px] bg-background border-white/10 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">
                    {editingMenuItem ? "Uredi Stavku" : "Dodaj Novu Stavku"}
                  </DialogTitle>
                  <DialogDescription>
                    Popunite informacije o stavci jelovnika. Polja označena sa * su obavezna.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Naziv *</Label>
                    <Input
                      id="name"
                      placeholder="npr. Margherita, Carbonara, Caesar Salad..."
                      value={menuFormData.name}
                      onChange={(e) => setMenuFormData({ ...menuFormData, name: e.target.value })}
                      className="bg-background/50 border-white/20 cursor-text"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Opis *</Label>
                    <Textarea
                      id="description"
                      placeholder="Opišite sastojke i pripremu..."
                      value={menuFormData.description}
                      onChange={(e) => setMenuFormData({ ...menuFormData, description: e.target.value })}
                      className="bg-background/50 border-white/20 cursor-text min-h-[80px]"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="category">Kategorija *</Label>
                    <Select 
                      value={menuFormData.category} 
                      onValueChange={(value: any) => setMenuFormData({ ...menuFormData, category: value })}
                    >
                      <SelectTrigger className="bg-background/50 border-white/20 cursor-pointer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-white/10">
                        <SelectItem value="pizza" className="cursor-pointer">🍕 Pizze</SelectItem>
                        <SelectItem value="pasta" className="cursor-pointer">🍝 Paste</SelectItem>
                        <SelectItem value="salad" className="cursor-pointer">🥗 Salate</SelectItem>
                        <SelectItem value="side" className="cursor-pointer">🍟 Dodaci</SelectItem>
                        <SelectItem value="breakfast" className="cursor-pointer">🍳 Doručak</SelectItem>
                        <SelectItem value="sandwich" className="cursor-pointer">🥪 Sendviči</SelectItem>
                        <SelectItem value="main_course" className="cursor-pointer">🍖 Glavna Jela</SelectItem>
                        <SelectItem value="coffee" className="cursor-pointer">☕ Kafa</SelectItem>
                        <SelectItem value="drink" className="cursor-pointer">🥤 Voda</SelectItem>
                        <SelectItem value="juice" className="cursor-pointer">🧃 Sokovi</SelectItem>
                        <SelectItem value="fresh_juice" className="cursor-pointer">🍊 Fresh Sokovi</SelectItem>
                        <SelectItem value="beer" className="cursor-pointer">🍺 Pivo</SelectItem>
                        <SelectItem value="wine" className="cursor-pointer">🍷 Vino</SelectItem>
                        <SelectItem value="alcohol" className="cursor-pointer">🥃 Žestoka Pića</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price or Sizes */}
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <Label>Cene *</Label>
                      <div className="flex gap-2">
                        {menuFormData.sizes.length === 0 && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setMenuFormData({ 
                              ...menuFormData, 
                              sizes: [{ name: "32cm", price: "" }, { name: "42cm", price: "" }],
                              price: ""
                            })}
                            className="h-8 text-xs"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Dodaj veličine
                          </Button>
                        )}
                        {menuFormData.sizes.length > 0 && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setMenuFormData({ ...menuFormData, sizes: [] })}
                            className="h-8 text-xs"
                          >
                            <X className="h-3 w-3 mr-1" />
                            Ukloni veličine
                          </Button>
                        )}
                      </div>
                    </div>

                    {menuFormData.sizes.length === 0 ? (
                      <div className="grid gap-2">
                        <Input
                          id="price"
                          type="number"
                          placeholder="Unesite cenu (npr. 800)"
                          value={menuFormData.price}
                          onChange={(e) => setMenuFormData({ ...menuFormData, price: e.target.value })}
                          className="bg-background/50 border-white/20 cursor-text"
                          min="1"
                        />
                        <p className="text-xs text-white/60">
                          Za proizvode sa jednom cenom (pića, salate, itd.)
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-2">
                        {menuFormData.sizes.map((size, index) => (
                          <div key={index} className="flex gap-2 items-start">
                            <div className="flex-1 grid grid-cols-2 gap-2">
                              <Input
                                type="text"
                                placeholder="Veličina (npr. 32cm)"
                                value={size.name}
                                onChange={(e) => {
                                  const newSizes = [...menuFormData.sizes];
                                  newSizes[index].name = e.target.value;
                                  setMenuFormData({ ...menuFormData, sizes: newSizes });
                                }}
                                className="bg-background/50 border-white/20 cursor-text"
                              />
                              <Input
                                type="number"
                                placeholder="Cena (RSD)"
                                value={size.price}
                                onChange={(e) => {
                                  const newSizes = [...menuFormData.sizes];
                                  newSizes[index].price = e.target.value;
                                  setMenuFormData({ ...menuFormData, sizes: newSizes });
                                }}
                                className="bg-background/50 border-white/20 cursor-text"
                                min="1"
                              />
                            </div>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() => {
                                const newSizes = menuFormData.sizes.filter((_, i) => i !== index);
                                setMenuFormData({ ...menuFormData, sizes: newSizes });
                              }}
                              className="h-10 w-10 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setMenuFormData({ 
                            ...menuFormData, 
                            sizes: [...menuFormData.sizes, { name: "", price: "" }]
                          })}
                          className="w-full"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Dodaj još jednu veličinu
                        </Button>
                        <p className="text-xs text-white/60">
                          Za proizvode sa više veličina (pice, pića različitih dimenzija, itd.)
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="image">Slika</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                        className="bg-background/50 border-white/20 cursor-pointer file:cursor-pointer"
                      />
                      {menuFormData.imageUrl && (
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/20 shrink-0">
                          <img 
                            src={menuFormData.imageUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    {isUploading && <p className="text-xs text-blue-400">Upload-ovanje slike...</p>}
                    <p className="text-xs text-white/60">
                      Podržani formati: JPG, PNG, WEBP (max 5MB)
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      id="available"
                      checked={menuFormData.available}
                      onCheckedChange={(checked) => setMenuFormData({ ...menuFormData, available: checked })}
                      className="cursor-pointer"
                    />
                    <Label htmlFor="available" className="cursor-pointer">
                      Dostupno za poručivanje
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      id="featured"
                      checked={menuFormData.featured}
                      onCheckedChange={(checked) => setMenuFormData({ ...menuFormData, featured: checked })}
                      className="cursor-pointer"
                    />
                    <Label htmlFor="featured" className="cursor-pointer">
                      Istaknut proizvod (prikazuje se na početnoj strani)
                    </Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      id="isNew"
                      checked={menuFormData.isNew}
                      onCheckedChange={(checked) => setMenuFormData({ ...menuFormData, isNew: checked })}
                      className="cursor-pointer"
                    />
                    <Label htmlFor="isNew" className="cursor-pointer">
                      Novi proizvod (prikazuje "NOVO" oznaku)
                    </Label>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsMenuDialogOpen(false)}
                    className="flex-1 cursor-pointer"
                  >
                    Otkaži
                  </Button>
                  <Button
                    onClick={handleSaveMenuItem}
                    disabled={isUploading}
                    className="flex-1 bg-primary hover:bg-primary/90 cursor-pointer"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    {editingMenuItem ? "Sačuvaj Izmene" : "Dodaj Stavku"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="gallery" className="mt-6">
            <Card className="bg-background/50 border-white/10">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Image className="w-5 h-5" />
                    Upravljanje Galerijom
                  </CardTitle>
                  <Dialog open={isGalleryDialogOpen} onOpenChange={setIsGalleryDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-primary hover:bg-primary/90 cursor-pointer">
                        <ImagePlus className="w-4 h-4 mr-2" />
                        Dodaj Sliku
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-background border-white/10">
                      <DialogHeader>
                        <DialogTitle>Dodaj Novu Sliku u Galeriju</DialogTitle>
                        <DialogDescription>
                          Popunite informacije za novu sliku u galeriji
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="gallery-image">Slika</Label>
                          <div className="flex gap-2">
                            <Input
                              id="gallery-image"
                              placeholder="URL slike ili upload-ujte..."
                              value={galleryFormData.imageUrl}
                              onChange={(e) => setGalleryFormData({ ...galleryFormData, imageUrl: e.target.value })}
                              className="bg-background/50 border-white/20"
                            />
                            <Button
                              variant="outline"
                              onClick={async () => {
                                const input = document.createElement("input");
                                input.type = "file";
                                input.accept = "image/*";
                                input.onchange = async (e) => {
                                  const file = (e.target as HTMLInputElement).files?.[0];
                                  if (file) {
                                    setIsUploading(true);
                                    const formData = new FormData();
                                    formData.append("image", file);
                                    try {
                                      const response = await fetch("/api/upload", {
                                        method: "POST",
                                        body: formData,
                                        credentials: "include",
                                      });
                                      const data = await response.json();
                                      if (data.success) {
                                        setGalleryFormData({ ...galleryFormData, imageUrl: data.imageUrl });
                                        toast.success("Slika upload-ovana!");
                                      }
                                    } catch (error) {
                                      toast.error("Greška pri upload-u slike");
                                    } finally {
                                      setIsUploading(false);
                                    }
                                  }
                                };
                                input.click();
                              }}
                              className="cursor-pointer"
                              disabled={isUploading}
                            >
                              <Upload className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="gallery-alt">Opis Slike</Label>
                          <Input
                            id="gallery-alt"
                            placeholder="npr. Pršuta Pica"
                            value={galleryFormData.altText}
                            onChange={(e) => setGalleryFormData({ ...galleryFormData, altText: e.target.value })}
                            className="bg-background/50 border-white/20"
                          />
                        </div>
                        <div>
                          <Label htmlFor="gallery-order">Redosled Prikaza (opciono)</Label>
                          <Input
                            id="gallery-order"
                            type="number"
                            placeholder="0"
                            value={galleryFormData.displayOrder}
                            onChange={(e) => setGalleryFormData({ ...galleryFormData, displayOrder: e.target.value })}
                            className="bg-background/50 border-white/20"
                          />
                        </div>
                        <div className="flex gap-3 pt-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsGalleryDialogOpen(false);
                              setGalleryFormData({ imageUrl: "", altText: "", displayOrder: "" });
                            }}
                            className="flex-1 cursor-pointer"
                          >
                            Otkaži
                          </Button>
                          <Button
                            onClick={handleAddGalleryImage}
                            disabled={addGalleryMutation.isPending}
                            className="flex-1 bg-primary hover:bg-primary/90 cursor-pointer"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Dodaj u Galeriju
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {galleryImages.length === 0 ? (
                  <div className="text-center py-12 text-white/40">
                    <Image className="w-12 h-12 mx-auto mb-4 opacity-40" />
                    <p className="text-lg font-semibold">Nema slika u galeriji</p>
                    <p className="text-sm mt-2">Dodajte nove slike koristeći dugme "Dodaj Sliku"</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {galleryImages.map((image) => (
                      <div
                        key={image.id}
                        className="relative group overflow-hidden rounded-lg border border-white/10 bg-background/30"
                      >
                        <div className="aspect-[4/5] overflow-hidden">
                          <img
                            src={image.imageUrl}
                            alt={image.altText}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                        <div className="p-4">
                          <p className="font-semibold mb-1">{image.altText}</p>
                          <p className="text-xs text-white/60">Redosled: {image.displayOrder}</p>
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeleteGalleryImage(image.id)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Card className="bg-background/50 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Analitika i statistika
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!analytics ? (
                  <div className="text-center py-12 text-white/40">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-40 animate-pulse" />
                    <p className="text-lg font-semibold">Učitavanje statistike...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-6 rounded-lg bg-background/30 border border-white/10">
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Pizza className="w-5 h-5 text-primary" />
                        Statistika Menija
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-white/60">Ukupno stavki:</span>
                          <span className="font-bold text-xl">{analytics.menuItems.total}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/60">Dostupno:</span>
                          <span className="font-bold text-xl text-green-500">{analytics.menuItems.available}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/60">Izdvojeno:</span>
                          <span className="font-bold text-xl text-primary">{analytics.menuItems.featured}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-lg bg-background/30 border border-white/10">
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        Statistika Recenzija
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-white/60">Ukupno:</span>
                          <span className="font-bold text-xl">{analytics.reviews.total}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/60">Odobreno:</span>
                          <span className="font-bold text-xl text-green-500">{analytics.reviews.approved}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/60">Prosečna ocena:</span>
                          <span className="font-bold text-xl text-yellow-500">
                            {analytics.reviews.averageRating > 0 ? analytics.reviews.averageRating.toFixed(1) : "N/A"}
                            {analytics.reviews.averageRating > 0 && " ⭐"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-lg bg-background/30 border border-white/10">
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <Tag className="w-5 h-5 text-secondary" />
                        Statistika Kupona
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-white/60">Ukupno:</span>
                          <span className="font-bold text-xl">{analytics.coupons.total}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/60">Aktivnih:</span>
                          <span className="font-bold text-xl text-green-500">{analytics.coupons.active}</span>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2 lg:col-span-3 p-6 rounded-lg bg-background/30 border border-white/10">
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Top 5 Izdvojenih Proizvoda
                      </h3>
                      {analytics.topItems && analytics.topItems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                          {analytics.topItems.map((item: MenuItem) => (
                            <div key={item.id} className="p-4 rounded-lg bg-background/50 border border-white/10">
                              {item.imageUrl && (
                                <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
                                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                              )}
                              <h4 className="font-semibold mb-1 truncate">{item.name}</h4>
                              <p className="text-sm text-white/60 truncate">{item.category}</p>
                              {item.price && (
                                <p className="text-sm text-primary font-bold mt-2">{item.price} RSD</p>
                              )}
                              {item.price32 && item.price42 && (
                                <p className="text-sm text-primary font-bold mt-2">
                                  {item.price32} / {item.price42} RSD
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-white/40 py-8">Nema izdvojenih proizvoda</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coupons" className="mt-6">
            <Card className="bg-background/50 border-white/10">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-primary" />
                    Upravljanje Kuponima
                  </CardTitle>
                  <Dialog open={isCouponDialogOpen} onOpenChange={setIsCouponDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={openAddCouponDialog} className="bg-primary hover:bg-primary/90 cursor-pointer">
                        <Plus className="w-4 h-4 mr-2" />
                        Novi Kupon
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-background border-white/10 max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{editingCoupon ? "Izmeni Kupon" : "Kreiraj Novi Kupon"}</DialogTitle>
                        <DialogDescription>
                          {editingCoupon ? "Ažuriraj informacije o kuponu" : "Dodaj novi kupon za promociju"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="coupon-code">Kod Kupona *</Label>
                            <Input
                              id="coupon-code"
                              placeholder="LETO2024"
                              value={couponFormData.code}
                              onChange={(e) => setCouponFormData({ ...couponFormData, code: e.target.value.toUpperCase() })}
                              className="bg-background/50 border-white/20 uppercase"
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="discount-type">Tip Popusta *</Label>
                            <Select
                              value={couponFormData.discountType}
                              onValueChange={(value: "percentage" | "fixed") =>
                                setCouponFormData({ ...couponFormData, discountType: value })
                              }
                            >
                              <SelectTrigger className="bg-background/50 border-white/20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="percentage">Procenat (%)</SelectItem>
                                <SelectItem value="fixed">Fiksni iznos (RSD)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="discount-value">
                              Vrednost Popusta * ({couponFormData.discountType === "percentage" ? "%" : "RSD"})
                            </Label>
                            <Input
                              id="discount-value"
                              type="number"
                              placeholder={couponFormData.discountType === "percentage" ? "10" : "500"}
                              value={couponFormData.discountValue}
                              onChange={(e) => setCouponFormData({ ...couponFormData, discountValue: e.target.value })}
                              className="bg-background/50 border-white/20"
                              required
                              min="1"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="min-order">Min. Vrednost Narudžbine (RSD)</Label>
                            <Input
                              id="min-order"
                              type="number"
                              placeholder="0"
                              value={couponFormData.minOrder}
                              onChange={(e) => setCouponFormData({ ...couponFormData, minOrder: e.target.value })}
                              className="bg-background/50 border-white/20"
                              min="0"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="max-uses">Maksimalan Broj Iskorišćenja</Label>
                            <Input
                              id="max-uses"
                              type="number"
                              placeholder="Bez limita"
                              value={couponFormData.maxUses}
                              onChange={(e) => setCouponFormData({ ...couponFormData, maxUses: e.target.value })}
                              className="bg-background/50 border-white/20"
                              min="1"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="expires-at">Ističe</Label>
                            <Input
                              id="expires-at"
                              type="datetime-local"
                              value={couponFormData.expiresAt}
                              onChange={(e) => setCouponFormData({ ...couponFormData, expiresAt: e.target.value })}
                              className="bg-background/50 border-white/20"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <Switch
                            id="is-active"
                            checked={couponFormData.isActive}
                            onCheckedChange={(checked) => setCouponFormData({ ...couponFormData, isActive: checked })}
                            className="cursor-pointer"
                          />
                          <Label htmlFor="is-active" className="cursor-pointer">
                            Aktivan (vidljiv korisnicima)
                          </Label>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <Button
                            variant="outline"
                            onClick={() => setIsCouponDialogOpen(false)}
                            className="flex-1 cursor-pointer"
                          >
                            Otkaži
                          </Button>
                          <Button
                            onClick={handleSaveCoupon}
                            className="flex-1 bg-primary hover:bg-primary/90 cursor-pointer"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            {editingCoupon ? "Sačuvaj Izmene" : "Kreiraj Kupon"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {coupons.length === 0 ? (
                  <div className="text-center py-12 text-white/40">
                    <Tag className="w-12 h-12 mx-auto mb-4 opacity-40" />
                    <p className="text-lg font-semibold">Nema kreiranih kupona</p>
                    <p className="text-sm mt-2">Dodajte novi kupon koristeći dugme "Novi Kupon"</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                    <table className="w-full min-w-[800px]">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-2 text-sm font-semibold text-white/60">Kod</th>
                          <th className="text-left py-3 px-2 text-sm font-semibold text-white/60">Tip</th>
                          <th className="text-left py-3 px-2 text-sm font-semibold text-white/60">Vrednost</th>
                          <th className="text-left py-3 px-2 text-sm font-semibold text-white/60">Min. Narudžbina</th>
                          <th className="text-left py-3 px-2 text-sm font-semibold text-white/60">Iskorišćeno/Max</th>
                          <th className="text-left py-3 px-2 text-sm font-semibold text-white/60">Ističe</th>
                          <th className="text-left py-3 px-2 text-sm font-semibold text-white/60">Status</th>
                          <th className="text-right py-3 px-2 text-sm font-semibold text-white/60">Akcije</th>
                        </tr>
                      </thead>
                      <tbody>
                        {coupons.map((coupon) => (
                          <tr key={coupon.id} className="border-b border-white/5 hover:bg-white/5">
                            <td className="py-3 px-2">
                              <span className="font-mono font-bold text-primary">{coupon.code}</span>
                            </td>
                            <td className="py-3 px-2">
                              <Badge variant="outline" className="text-xs">
                                {coupon.discountType === "percentage" ? "Procenat" : "Fiksni"}
                              </Badge>
                            </td>
                            <td className="py-3 px-2 font-semibold">
                              {coupon.discountType === "percentage"
                                ? `${coupon.discountValue}%`
                                : `${coupon.discountValue} RSD`}
                            </td>
                            <td className="py-3 px-2 text-white/60">
                              {coupon.minOrder ? `${coupon.minOrder} RSD` : "-"}
                            </td>
                            <td className="py-3 px-2">
                              <span className="text-white/80">
                                {coupon.usedCount} / {coupon.maxUses || "∞"}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-white/60 text-sm">
                              {coupon.expiresAt
                                ? new Date(coupon.expiresAt).toLocaleDateString("sr-RS")
                                : "Bez ograničenja"}
                            </td>
                            <td className="py-3 px-2">
                              <Badge
                                variant={coupon.isActive ? "default" : "secondary"}
                                className={coupon.isActive ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}
                              >
                                {coupon.isActive ? "Aktivan" : "Neaktivan"}
                              </Badge>
                            </td>
                            <td className="py-3 px-2">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => openEditCouponDialog(coupon)}
                                  className="cursor-pointer h-8 w-8"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
                                  className="cursor-pointer h-8 w-8"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card className="bg-background/50 border-white/10">
              <CardHeader>
                <div className="flex flex-col gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Upravljanje Recenzijama
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant={reviewsFilter === "all" ? "default" : "outline"}
                      onClick={() => setReviewsFilter("all")}
                      className="cursor-pointer"
                      size="sm"
                    >
                      Sve ({reviews.length})
                    </Button>
                    <Button
                      variant={reviewsFilter === "approved" ? "default" : "outline"}
                      onClick={() => setReviewsFilter("approved")}
                      className="cursor-pointer"
                      size="sm"
                    >
                      Odobrene ({reviews.filter((r) => r.isApproved).length})
                    </Button>
                    <Button
                      variant={reviewsFilter === "pending" ? "default" : "outline"}
                      onClick={() => setReviewsFilter("pending")}
                      className="cursor-pointer"
                      size="sm"
                    >
                      Na čekanju ({pendingReviewsCount})
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <div className="text-center py-12 text-white/40">
                    <Star className="w-12 h-12 mx-auto mb-4 opacity-40" />
                    <p className="text-lg font-semibold">Nema recenzija</p>
                    <p className="text-sm mt-2">Recenzije će se pojaviti kada ih korisnici ostave</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews
                      .filter((review) => {
                        if (reviewsFilter === "approved") return review.isApproved;
                        if (reviewsFilter === "pending") return !review.isApproved;
                        return true;
                      })
                      .map((review) => (
                        <div
                          key={review.id}
                          className="p-4 rounded-lg bg-background/30 border border-white/10 hover:bg-background/40 transition-colors"
                        >
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-3 flex-wrap">
                                <h4 className="font-semibold text-lg">{review.customerName}</h4>
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-white/20"
                                      }`}
                                    />
                                  ))}
                                  <span className="ml-1 text-sm text-white/60">({review.rating}/5)</span>
                                </div>
                                <Badge
                                  variant={review.isApproved ? "default" : "secondary"}
                                  className={
                                    review.isApproved
                                      ? "bg-green-500/20 text-green-500"
                                      : "bg-yellow-500/20 text-yellow-500"
                                  }
                                >
                                  {review.isApproved ? "Odobreno" : "Na čekanju"}
                                </Badge>
                              </div>
                              <p className="text-white/80">{review.comment}</p>
                              <p className="text-xs text-white/40">
                                {new Date(review.createdAt!).toLocaleDateString("sr-RS", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                            <div className="flex md:flex-col gap-2">
                              {!review.isApproved && (
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleApproveReview(review.id)}
                                  className="bg-green-500 hover:bg-green-600 cursor-pointer"
                                >
                                  <Check className="w-4 h-4 mr-2" />
                                  Odobri
                                </Button>
                              )}
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteReview(review.id)}
                                className="cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Obriši
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card className="bg-background/50 border-white/10">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Upravljanje Korisnicima
                  </CardTitle>
                  <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-primary hover:bg-primary/90 cursor-pointer">
                        <Plus className="w-4 h-4 mr-2" />
                        Dodaj Admin Korisnika
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-background border-white/10">
                      <DialogHeader>
                        <DialogTitle>Kreiraj Novog Admin Korisnika</DialogTitle>
                        <DialogDescription>
                          Dodajte novog administratora koji će imati pristup admin panelu.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-username">Korisničko Ime</Label>
                          <Input
                            id="new-username"
                            value={userFormData.username}
                            onChange={(e) =>
                              setUserFormData({ ...userFormData, username: e.target.value })
                            }
                            placeholder="admin2"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">Lozinka</Label>
                          <Input
                            id="new-password"
                            type="password"
                            value={userFormData.password}
                            onChange={(e) =>
                              setUserFormData({ ...userFormData, password: e.target.value })
                            }
                            placeholder="••••••••"
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            onClick={() => setIsUserDialogOpen(false)}
                            className="cursor-pointer"
                          >
                            Otkaži
                          </Button>
                          <Button
                            onClick={handleCreateUser}
                            className="bg-primary hover:bg-primary/90 cursor-pointer"
                          >
                            Kreiraj Korisnika
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <div className="text-center py-12 text-white/40">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-40" />
                    <p className="text-lg font-semibold">Nema korisnika</p>
                    <p className="text-sm mt-2">Kreirajte prvog admin korisnika</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-3 px-4 font-semibold text-white/80">ID</th>
                          <th className="text-left py-3 px-4 font-semibold text-white/80">Korisničko Ime</th>
                          <th className="text-left py-3 px-4 font-semibold text-white/80">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr
                            key={user.id}
                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                          >
                            <td className="py-3 px-4 text-sm text-white/60 font-mono">
                              {user.id.slice(0, 8)}...
                            </td>
                            <td className="py-3 px-4 font-medium">{user.username}</td>
                            <td className="py-3 px-4">
                              <Badge className="bg-green-500/20 text-green-500">Aktivan</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <Card className="bg-background/50 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Upravljanje Sadržajem Sajta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="hero_title">Hero Naslov</Label>
                    <Input
                      id="hero_title"
                      value={siteContentForm.hero_title || ""}
                      onChange={(e) => handleSiteContentChange("hero_title", e.target.value)}
                      onBlur={(e) => updateSiteContentField("hero_title", e.target.value)}
                      placeholder="Ukus Prave Italije"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hero_subtitle">Hero Podnaslov</Label>
                    <Textarea
                      id="hero_subtitle"
                      value={siteContentForm.hero_subtitle || ""}
                      onChange={(e) => handleSiteContentChange("hero_subtitle", e.target.value)}
                      onBlur={(e) => updateSiteContentField("hero_subtitle", e.target.value)}
                      placeholder="Autentična italijanska kuhinja..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-lg font-semibold mb-4">O Nama Sekcija</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="about_text1">Prvi Paragraf</Label>
                      <Textarea
                        id="about_text1"
                        value={siteContentForm.about_text1 || ""}
                        onChange={(e) => handleSiteContentChange("about_text1", e.target.value)}
                        onBlur={(e) => updateSiteContentField("about_text1", e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="about_text2">Drugi Paragraf</Label>
                      <Textarea
                        id="about_text2"
                        value={siteContentForm.about_text2 || ""}
                        onChange={(e) => handleSiteContentChange("about_text2", e.target.value)}
                        onBlur={(e) => updateSiteContentField("about_text2", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Kontakt Informacije</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact_phone">Telefon</Label>
                      <Input
                        id="contact_phone"
                        value={siteContentForm.contact_phone || ""}
                        onChange={(e) => handleSiteContentChange("contact_phone", e.target.value)}
                        onBlur={(e) => updateSiteContentField("contact_phone", e.target.value)}
                        placeholder="011 2405320"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact_address">Adresa</Label>
                      <Input
                        id="contact_address"
                        value={siteContentForm.contact_address || ""}
                        onChange={(e) => handleSiteContentChange("contact_address", e.target.value)}
                        onBlur={(e) => updateSiteContentField("contact_address", e.target.value)}
                        placeholder="Dimitrija Tucovića 119"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact_city">Grad</Label>
                      <Input
                        id="contact_city"
                        value={siteContentForm.contact_city || ""}
                        onChange={(e) => handleSiteContentChange("contact_city", e.target.value)}
                        onBlur={(e) => updateSiteContentField("contact_city", e.target.value)}
                        placeholder="Beograd"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact_postal">Poštanski Broj</Label>
                      <Input
                        id="contact_postal"
                        value={siteContentForm.contact_postal || ""}
                        onChange={(e) => handleSiteContentChange("contact_postal", e.target.value)}
                        onBlur={(e) => updateSiteContentField("contact_postal", e.target.value)}
                        placeholder="11050"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Radno Vreme</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hours_weekdays">Radni Dani</Label>
                      <Input
                        id="hours_weekdays"
                        value={siteContentForm.hours_weekdays || ""}
                        onChange={(e) => handleSiteContentChange("hours_weekdays", e.target.value)}
                        onBlur={(e) => updateSiteContentField("hours_weekdays", e.target.value)}
                        placeholder="Pon-Čet: 09:00 - 00:00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hours_weekend">Vikend</Label>
                      <Input
                        id="hours_weekend"
                        value={siteContentForm.hours_weekend || ""}
                        onChange={(e) => handleSiteContentChange("hours_weekend", e.target.value)}
                        onBlur={(e) => updateSiteContentField("hours_weekend", e.target.value)}
                        placeholder="Pet-Sub: 09:00 - 01:00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hours_sunday">Nedelja</Label>
                      <Input
                        id="hours_sunday"
                        value={siteContentForm.hours_sunday || ""}
                        onChange={(e) => handleSiteContentChange("hours_sunday", e.target.value)}
                        onBlur={(e) => updateSiteContentField("hours_sunday", e.target.value)}
                        placeholder="Ned: 12:00 - 00:00"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card className="bg-background/50 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                  <Settings className="w-5 h-5 text-primary" />
                  Postavke Naručivanja
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6 bg-background/30 rounded-lg border border-white/10">
                  <div className="space-y-1 flex-1">
                    <h3 className="text-base sm:text-lg font-semibold">Omogući Online Naručivanje</h3>
                    <p className="text-xs sm:text-sm text-white/60">
                      Uključi ili isključi mogućnost naručivanja preko sajta.
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end sm:flex-shrink-0">
                    <span className="text-sm sm:hidden text-white/70 mr-3">
                      {orderingEnabled ? "Uključeno" : "Isključeno"}
                    </span>
                    <Switch
                      checked={orderingEnabled}
                      onCheckedChange={handleToggleOrdering}
                      className="cursor-pointer"
                    />
                  </div>
                </div>

                <div className="p-3 sm:p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="mt-0.5">
                      {orderingEnabled ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      ) : (
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white/60" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-1 text-sm sm:text-base">
                        Status: {orderingEnabled ? "Aktivno" : "Neaktivno"}
                      </p>
                      <p className="text-xs sm:text-sm text-white/70">
                        {orderingEnabled 
                          ? "Naručivanje je trenutno omogućeno. Korisnici mogu da poručuju pice."
                          : "Naručivanje je trenutno onemogućeno."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Backup i Eksport Podataka</h3>
                  <div className="p-4 sm:p-6 bg-background/30 rounded-lg border border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <h4 className="text-base font-semibold">Preuzmi Backup</h4>
                        <p className="text-xs sm:text-sm text-white/60">
                          Preuzmite kompletnu kopiju svih podataka (meni, kuponi, recenzije, galerija, sadržaj) u JSON formatu.
                        </p>
                      </div>
                      <Button
                        onClick={handleDownloadBackup}
                        className="bg-secondary hover:bg-secondary/90 cursor-pointer shrink-0"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        📦 Preuzmi Backup
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Google Recenzije Integracija</h3>
                  <div className="p-4 sm:p-6 bg-background/30 rounded-lg border border-white/10 space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="google_api_key">Google Places API Key</Label>
                        <Input
                          id="google_api_key"
                          type="password"
                          placeholder="AIzaSy..."
                          className="font-mono text-sm"
                        />
                        <p className="text-xs text-white/60">
                          Nabavi API ključ na{" "}
                          <a 
                            href="https://console.cloud.google.com/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Google Cloud Console
                          </a>
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="google_place_id">Google Place ID</Label>
                        <Input
                          id="google_place_id"
                          placeholder="ChIJpyiwa4Zw44kRBQSGWKv4wgA"
                          className="font-mono text-sm"
                        />
                        <p className="text-xs text-white/60">
                          Pronađi Place ID na{" "}
                          <a 
                            href="https://developers.google.com/maps/documentation/places/web-service/place-id" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Google Place ID Finder
                          </a>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                      <Button
                        onClick={async () => {
                          const apiKey = (document.getElementById("google_api_key") as HTMLInputElement)?.value;
                          const placeId = (document.getElementById("google_place_id") as HTMLInputElement)?.value;

                          if (!apiKey || !placeId) {
                            toast.error("Greška", {
                              description: "Unesi Google Places API Key i Place ID",
                            });
                            return;
                          }

                          try {
                            await fetch("/api/settings", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ 
                                key: "google_places_api_key", 
                                value: apiKey 
                              }),
                            });
                            await fetch("/api/settings", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ 
                                key: "google_place_id", 
                                value: placeId 
                              }),
                            });
                            toast.success("Sačuvano!", {
                              description: "Google API podešavanja sačuvana",
                            });
                          } catch (error) {
                            toast.error("Greška", {
                              description: "Neuspelo čuvanje podešavanja",
                            });
                          }
                        }}
                        className="bg-secondary hover:bg-secondary/90 cursor-pointer flex-1"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        💾 Sačuvaj Podešavanja
                      </Button>
                      <Button
                        onClick={async () => {
                          try {
                            const response = await fetch("/api/reviews/fetch-from-google", {
                              method: "POST",
                            });
                            const data = await response.json();
                            
                            if (data.success) {
                              toast.success("Uspešno!", {
                                description: data.message,
                              });
                              loadReviews();
                            } else {
                              toast.error("Greška", {
                                description: data.message,
                              });
                            }
                          } catch (error) {
                            toast.error("Greška", {
                              description: "Neuspelo povlačenje recenzija",
                            });
                          }
                        }}
                        className="bg-primary hover:bg-primary/90 cursor-pointer flex-1"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        🌟 Povuci Google Recenzije
                      </Button>
                    </div>
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg mt-4">
                      <p className="text-xs sm:text-sm text-blue-300">
                        ℹ️ Povuci će se samo dobre recenzije (4-5 zvezdica). Duplikati se automatski filtriraju.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-6">
                  <h3 className="text-lg font-semibold mb-4">QR Kod za Jelovnik</h3>
                  <QRCodeGenerator />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
