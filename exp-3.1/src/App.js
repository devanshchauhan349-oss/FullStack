import React from "react";
import ProductCard from "./ProductCard";

function App() {
  return (
    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
      <ProductCard
        name="Wireless Headphones"
        price={99.99}
        description="High-quality sound with noise cancellation."
        image="https://www.simplygaming.in/cdn/shop/files/HyperX_Cloud_Stinger_2_Wireless_Gaming_Headset_Black.webp?v=1734080327"
        category="Electronics"
        rating={4.5}
      />
      <ProductCard
        name="Smart Watch"
        price={149.99}
        description="Track your fitness and stay connected."
        image="https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=327&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        category="Wearables"
        rating={4.2}
      />
      <ProductCard
        name="Gaming Laptop"
        price={1299.99}
        description="Powerful laptop for gaming and productivity."
        image="https://www.asus.com/media/Odin/Websites/global/ProductLine/20200824120814.jpg?webp"
        category="Computers"
        rating={4.8}
      />
    </div>
  );
}

export default App;