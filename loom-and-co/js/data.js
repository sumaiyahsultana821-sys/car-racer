/* Loom & Co. — product catalog (demo data, no backend) */

const CATEGORIES = [
  { id: 'dresses',     name: 'Dresses',     icon: '👗', blurb: 'Effortless silhouettes for every occasion' },
  { id: 'tops',        name: 'Tops',        icon: '👚', blurb: 'Everyday layers that go with everything' },
  { id: 'jeans',       name: 'Jeans',       icon: '👖', blurb: 'Denim cut to move with you' },
  { id: 'kurti-set',   name: 'Kurti Sets',  icon: '🥻', blurb: 'Traditional prints, modern fits' },
  { id: 'jackets',     name: 'Jackets',     icon: '🧥', blurb: 'Layer up without losing your look' },
  { id: 'shoes',       name: 'Shoes',       icon: '👟', blurb: 'From street to statement' },
  { id: 'accessories', name: 'Accessories', icon: '👜', blurb: 'The details that finish the outfit' },
];

const PRODUCTS = [
  { id: 1,  name: 'Floral Wrap Dress',          category: 'dresses',     price: 58, rating: 4.5, sizes: ['XS','S','M','L','XL'], hue: 340, tag: 'New', description: 'A featherlight wrap dress in a hand-painted floral print, cinched at the waist and finished with a flowing midi hem.' },
  { id: 2,  name: 'Satin Slip Dress',            category: 'dresses',     price: 64, rating: 4.7, sizes: ['XS','S','M','L'],      hue: 350, tag: 'New', description: 'Bias-cut satin that skims the body, with adjustable straps and a cowl neckline for effortless evening wear.' },
  { id: 3,  name: 'Bodycon Midi Dress',          category: 'dresses',     price: 49, rating: 4.3, sizes: ['S','M','L','XL'],      hue: 330, tag: null, description: 'Ribbed stretch jersey that holds its shape all day, cut close through the body with a flattering midi length.' },
  { id: 4,  name: 'Ribbed Knit Top',             category: 'tops',        price: 28, rating: 4.4, sizes: ['XS','S','M','L','XL'], hue: 205, tag: 'New', description: 'A soft ribbed knit with a relaxed crew neck — the layering top you will reach for every week.' },
  { id: 5,  name: 'Off-Shoulder Blouse',         category: 'tops',        price: 32, rating: 4.6, sizes: ['S','M','L'],           hue: 195, tag: 'Trending', description: 'Airy cotton-voile blouse with an off-shoulder neckline and elasticated cuffs for easy movement.' },
  { id: 6,  name: 'Graphic Crop Tee',            category: 'tops',        price: 22, rating: 4.2, sizes: ['XS','S','M','L','XL'], hue: 215, tag: null, description: 'A cropped, boxy tee in heavyweight cotton with a hand-drawn graphic print.' },
  { id: 7,  name: 'High-Rise Skinny Jeans',      category: 'jeans',       price: 45, rating: 4.5, sizes: ['24','26','28','30','32'], hue: 220, tag: 'Trending', description: 'Stretch denim that sits high on the waist and tapers through the leg for a sleek, all-day silhouette.' },
  { id: 8,  name: 'Wide-Leg Denim',              category: 'jeans',       price: 52, rating: 4.6, sizes: ['24','26','28','30','32'], hue: 210, tag: 'New', description: 'Relaxed wide-leg jeans in rigid denim with a cropped hem that pairs perfectly with heels or sneakers.' },
  { id: 9,  name: 'Distressed Boyfriend Jeans',  category: 'jeans',       price: 48, rating: 4.1, sizes: ['26','28','30','32','34'], hue: 225, tag: null, description: 'Lived-in boyfriend fit with hand-distressing at the knee and a rolled hem.' },
  { id: 10, name: 'Embroidered Anarkali Set',    category: 'kurti-set',   price: 72, rating: 4.8, sizes: ['S','M','L','XL'],      hue: 25,  tag: 'Trending', description: 'A flared anarkali kurti with thread embroidery, paired with matching churidar and dupatta.' },
  { id: 11, name: 'Cotton Printed Kurti Set',    category: 'kurti-set',   price: 54, rating: 4.5, sizes: ['S','M','L','XL'],      hue: 15,  tag: null, description: 'Breathable block-printed cotton kurti with straight-cut pants — a warm-weather staple.' },
  { id: 12, name: 'Chikankari Kurti Set',        category: 'kurti-set',   price: 68, rating: 4.7, sizes: ['S','M','L'],           hue: 35,  tag: 'New', description: 'Hand-stitched chikankari embroidery on soft georgette, with a coordinating dupatta.' },
  { id: 13, name: 'Oversized Denim Jacket',      category: 'jackets',     price: 65, rating: 4.6, sizes: ['S','M','L','XL'],      hue: 200, tag: 'Trending', description: 'A boxy, oversized denim jacket with dropped shoulders — layers over anything.' },
  { id: 14, name: 'Quilted Puffer Jacket',       category: 'jackets',     price: 85, rating: 4.4, sizes: ['S','M','L','XL'],      hue: 260, tag: null, description: 'Lightweight fill keeps this quilted puffer warm without the bulk, with a stand collar and zip pockets.' },
  { id: 15, name: 'Faux Leather Biker Jacket',   category: 'jackets',     price: 79, rating: 4.7, sizes: ['XS','S','M','L'],      hue: 10,  tag: 'New', description: 'A sharp-shouldered biker jacket in vegan leather with asymmetric zip and quilted elbows.' },
  { id: 16, name: 'Chunky Platform Sneakers',    category: 'shoes',       price: 70, rating: 4.5, sizes: ['5','6','7','8','9'],   hue: 40,  tag: 'Trending', description: 'A chunky platform sole gives these everyday sneakers extra height and cushioning.' },
  { id: 17, name: 'Strappy Block Heels',         category: 'shoes',       price: 56, rating: 4.3, sizes: ['5','6','7','8','9'],   hue: 355, tag: null, description: 'Comfortable block heels with crossover ankle straps — dressy enough for evening, stable enough for all day.' },
  { id: 18, name: 'Classic White Sneakers',      category: 'shoes',       price: 60, rating: 4.6, sizes: ['5','6','7','8','9'],   hue: 0,   tag: 'New', description: 'A clean, minimal leather sneaker that goes with absolutely everything in your closet.' },
  { id: 19, name: 'Gold Layered Necklace',       category: 'accessories', price: 24, rating: 4.6, sizes: ['One Size'],           hue: 45,  tag: 'Trending', description: 'Three delicate chains layered at different lengths, finished in tarnish-resistant gold plating.' },
  { id: 20, name: 'Structured Tote Bag',         category: 'accessories', price: 46, rating: 4.5, sizes: ['One Size'],           hue: 30,  tag: 'New', description: 'A roomy structured tote in vegan leather with an interior zip pocket — fits a laptop with room to spare.' },
  { id: 21, name: 'Oversized Sunglasses',        category: 'accessories', price: 18, rating: 4.2, sizes: ['One Size'],           hue: 270, tag: null, description: 'Oversized frames with UV400 protection and a polished acetate finish.' },
  { id: 22, name: 'Woven Belt',                  category: 'accessories', price: 16, rating: 4.4, sizes: ['S/M','L/XL'],         hue: 90,  tag: null, description: 'A braided woven belt with an antique-brass buckle, cut to sit at the natural waist.' },
];

function getProductById(id) {
  return PRODUCTS.find(p => p.id === Number(id));
}

function getCategoryById(id) {
  return CATEGORIES.find(c => c.id === id);
}
