import fs from "fs";

const path = "c:/Users/HP Core i5/Desktop/SGB MILITARY/components/store/Header.tsx";
let code = fs.readFileSync(path, "utf-8");

// Add Search import
code = code.replace(/import \{ ShoppingCart, Menu, X, ChevronRight \} from "lucide-react";/, `import { ShoppingCart, Menu, X, ChevronRight, Search } from "lucide-react";`);

// Add import SearchOverlay
code = code.replace(/import CartDrawer from ".\/CartDrawer";/, `import CartDrawer from "./CartDrawer";\nimport SearchOverlay from "./SearchOverlay";`);

// Add state for search
code = code.replace(/const \[cartOpen, setCartOpen\] = useState\(false\);/, `const [cartOpen, setCartOpen] = useState(false);\n  const [searchOpen, setSearchOpen] = useState(false);`);

// Add Search button to UI
const oldActions = `<div className="flex items-center gap-4 lg:gap-6 z-50">`;
const newActions = `<div className="flex items-center gap-4 lg:gap-6 z-50">
            <button 
              onClick={() => setSearchOpen(true)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors group"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5 transition-transform group-hover:scale-110" />
            </button>`;
code = code.replace(oldActions, newActions);

// Add SearchOverlay component
const cartDrawer = `<CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />`;
const searchOverlay = `<CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />\n      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />`;
code = code.replace(cartDrawer, searchOverlay);

fs.writeFileSync(path, code, "utf-8");
console.log("Updated Header.tsx");
