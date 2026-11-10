// All site copy (VI / EN) + product data.
// Products & specs: psilabvnorg/PsiLab src/constants/catalog.ts
// Contact info:     psilabvnorg/PsiLab src/constants/site.ts

export const CONTACT = {
  company: 'Công ty TNHH PSI LAB VN',
  phoneDisplay: '0366 462 069',
  phoneTel: '+84366462069',
  zalo: 'https://zalo.me/0366462069',
  email: 'psi.lab.vn@gmail.com',
  messenger: 'https://m.me/tungxethovn',
  facebook: 'https://www.facebook.com/tungxethovn',
  tiktok: 'https://www.tiktok.com/@xedien6969',
  youtube: 'https://www.youtube.com/@psihubvn',
  warehouseMaps: 'https://maps.app.goo.gl/xSj8SHUmgVqXiWc29',
};

export const LINES = {
  move: { name: 'MOVE', label: { vi: 'Xe điện chở hàng', en: 'Electric vehicles' } },
  charge: { name: 'CHARGE', label: { vi: 'Sạc siêu nhanh', en: 'Fast charging' } },
  drive: { name: 'DRIVE', label: { vi: 'Lưu điện & biến tần', en: 'Storage & inverters' } },
  core: { name: 'CORE', label: { vi: 'Nguồn cho AI', en: 'AI power' } },
};

export const PRODUCTS = [
  {
    id: 'xe-cho-hang-inox-2-banh',
    line: 'move',
    imgs: [{ src: 'img/product-cargo-2-1.webp' }, { src: 'img/product-cargo-2-2.webp' }, { src: 'img/product-cargo-2-3.webp' }, { src: 'img/product-cargo-2-4.webp' }, { src: 'img/product-cargo-2-5.webp' }, { src: 'img/product-cargo-2-6.webp' }],
    name: { vi: 'Xe điện chở hàng Inox 304 · 2 bánh', en: 'Stainless 304 electric cargo bike · 2-wheel' },
    tagline: {
      vi: 'Khung Inox 304 cực bền, gọn gàng luồn lách phố đông.',
      en: 'Ultra-durable 304 stainless frame, nimble in city traffic.',
    },
    alt: { vi: 'Xe điện chở hàng PSI hai bánh', en: 'PSI two-wheel cargo bike' },
    price: 29000000,
    specs: [
      { v: '200', u: 'km', l: { vi: 'Quãng đường / lần sạc', en: 'Range per charge' } },
      { v: '150', u: 'km', l: { vi: 'Sạc nhanh 1 giờ', en: '1-hour fast charge' } },
      { v: '200', u: 'kg', l: { vi: 'Tải trọng', en: 'Payload' } },
    ],
  },
  {
    id: 'xe-cho-hang-inox-3-banh',
    line: 'move',
    imgs: [{ src: 'img/product-cargo-3-1.webp' }],
    name: { vi: 'Xe điện chở hàng Inox 304 · 3 bánh', en: 'Stainless 304 electric cargo trike · 3-wheel' },
    tagline: {
      vi: 'Chở nặng tới 1 tấn, thùng hàng rộng, vững chãi.',
      en: 'Carries up to 1 tonne on a wide, stable cargo bed.',
    },
    alt: { vi: 'Xe điện chở hàng ba bánh PSI chở thùng phuy', en: 'PSI three-wheel cargo trike carrying a drum' },
    price: 34000000,
    specs: [
      { v: '100', u: 'km', l: { vi: 'Quãng đường / lần sạc', en: 'Range per charge' } },
      { v: '80', u: 'km', l: { vi: 'Sạc nhanh 1 giờ', en: '1-hour fast charge' } },
      { v: '1', u: { vi: 'tấn', en: 't' }, l: { vi: 'Tải trọng', en: 'Payload' } },
    ],
  },
  {
    id: 'xe-vision-dien',
    line: 'move',
    imgs: [{ src: 'img/product-vision-1.webp' }, { src: 'img/product-vision-2.webp' }, { src: 'img/product-vision-3.webp' }, { src: 'img/product-vision-4.webp' }, { src: 'img/product-vision-5.webp' }, { src: 'img/product-vision-6.webp' }, { src: 'img/product-vision-7.webp' }, { src: 'img/product-vision-8.webp' }],
    name: { vi: 'Xe Vision điện', en: 'Electric Vision scooter' },
    tagline: {
      vi: 'Tay ga điện thanh lịch, cốp rộng để vừa 3 mũ bảo hiểm.',
      en: 'A sleek electric scooter with room for 3 helmets under the seat.',
    },
    alt: { vi: 'Xe Vision điện', en: 'Electric Vision scooter' },
    price: 34000000,
    specs: [
      { v: '200', u: 'km', l: { vi: 'Quãng đường / lần sạc', en: 'Range per charge' } },
      { v: '150', u: 'km', l: { vi: 'Sạc nhanh 1 giờ', en: '1-hour fast charge' } },
      { v: '3', u: { vi: 'mũ', en: '' }, l: { vi: 'Cốp xe', en: 'Helmets in the trunk' } },
    ],
  },
  {
    id: 'sac-sieu-nhanh-1-8kw',
    line: 'charge',
    imgs: [{ src: 'img/product-charger-1.webp' }, { src: 'img/product-charger-2.webp' }, { src: 'img/product-charger-3.webp' }],
    name: { vi: 'Sạc siêu nhanh 1,8 kW', en: '1.8 kW ultra-fast charger' },
    tagline: {
      vi: 'Một bộ sạc cho nhiều hãng xe: VinFast, Dat Bike, Yadea…',
      en: 'One charger for many brands: VinFast, Dat Bike, Yadea…',
    },
    alt: { vi: 'Bộ sạc siêu nhanh 1,8 kW PSI', en: 'PSI 1.8 kW ultra-fast charger' },
    specs: [
      { v: '1,8', u: 'kW', l: { vi: 'Công suất sạc', en: 'Charging power' } },
      { v: '80', u: '%', l: { vi: 'Pin sau 1 giờ', en: 'Battery after 1 hour' } },
    ],
  },
  {
    id: 'bo-luu-dien-inverter',
    line: 'drive',
    imgs: [{ src: 'img/product-storage-1.webp', contain: true }, { src: 'img/product-storage-2.webp' }, { src: 'img/product-storage-3.webp' }, { src: 'img/product-storage-4.webp' }, { src: 'img/product-storage-5.webp' }, { src: 'img/product-storage-6.webp' }],
    name: { vi: 'Bộ lưu điện Inverter', en: 'Inverter energy storage system' },
    tagline: {
      vi: 'Pin lưu + biến tần 3 kW, bù tải cùng máy nổ. Điện sin chuẩn như điện lưới.',
      en: 'Battery + 3 kW inverter, load-sharing with a generator. Pure sine wave like grid power.',
    },
    alt: { vi: 'Bộ lưu điện Inverter PSI và bộ pin', en: 'PSI inverter storage unit and battery packs' },
    specs: [
      { v: '2–10', u: 'kWh', l: { vi: 'Dung lượng lưu', en: 'Storage capacity' } },
      { v: '3', u: 'kW', l: { vi: 'Biến tần', en: 'Inverter' } },
    ],
  },
  {
    id: 'bo-nguon-gpu',
    line: 'core',
    imgs: [{ src: 'img/product-gpu-1.webp', contain: true }],
    name: { vi: 'Bộ nguồn cho GPU', en: 'GPU power supply' },
    tagline: {
      vi: 'Nguồn chính xác tới từng milivôn cho máy chủ AI, vận hành liên tục.',
      en: 'Millivolt-accurate power for AI servers, built for continuous operation.',
    },
    alt: { vi: 'Bộ nguồn GPU', en: 'GPU power supply unit' },
    specs: [
      { v: '2–10', u: 'kW', l: { vi: 'Công suất', en: 'Power' } },
      { v: 'mV', u: '', l: { vi: 'Chính xác tới từng milivôn', en: 'Millivolt precision' } },
    ],
  },
];

export const T = {
  vi: {
    'meta.title': 'PSI Technology · Xe điện chở hàng, sạc siêu nhanh, lưu điện & nguồn cho AI',
    'meta.desc':
      'PSI Technology (Công ty TNHH PSI LAB VN): xe điện chở hàng Inox 304, sạc siêu nhanh 1,8 kW, bộ lưu điện Inverter và bộ nguồn GPU.',
    'nav.skip': 'Bỏ qua đến nội dung',
    'nav.about': 'Giới thiệu',
    'nav.lines': 'Hệ sinh thái',
    'nav.products': 'Sản phẩm',
    'nav.network': 'Mạng lưới sạc',
    'nav.contact': 'Liên hệ',
    'nav.call': 'Gọi',
    'nav.menu': 'Mở menu',

    'hero.eyebrow': 'PSI Technology · PSI LAB VN',
    'hero.title': 'Một nền tảng năng lượng. Từ đường phố đến máy chủ AI.',
    'hero.lead': 'Xe điện chở hàng, sạc siêu nhanh, lưu điện và nguồn cho AI, do PSI thiết kế và sản xuất tại Việt Nam.',
    'hero.cta1': 'Xem sản phẩm',
    'hero.cta2': 'Nhắn tin tư vấn',
    'usp.1t': 'Singapore × Việt Nam',
    'usp.1d': 'Đội ngũ sáng lập tại Hà Nội và Singapore',
    'usp.2t': 'R&D nội bộ, tích hợp dọc',
    'usp.2d': 'Tự thiết kế, gia công và lắp ráp: từ khung xe, bộ pin đến bộ sạc',
    'usp.3t': 'AI-first',
    'usp.3d': 'Vốn đầu tư thấp, tăng trưởng cao',
    'usp.4t': 'Phần cứng mạnh phần mềm',
    'usp.4d': 'Tự xây web, ứng dụng và tự động hoá vận hành',
    'slide.prev': 'Ảnh trước',
    'slide.next': 'Ảnh tiếp theo',
    'slide.go': 'Xem ảnh',
    'hero.scroll': 'Cuộn để khám phá',

    'about.eyebrow': '05 · Về PSI',
    'about.title': 'Từ xưởng của chúng tôi ra đường phố.',
    'about.body':
      'PSI LAB VN thiết kế, gia công và lắp ráp tại Việt Nam. Đội ngũ kỹ sư điện, cơ khí và tự động hoá làm chủ từ khung Inox 304, bộ pin đến bộ sạc, nên mỗi sản phẩm đều được kiểm soát từ xưởng đến tay khách hàng.',
    'about.c1': 'Kỹ thuật điện',
    'about.c2': 'Kỹ thuật cơ khí',
    'about.c3': 'Tự động hoá',
    'about.c4': 'Gia công CNC',
    'about.c5': 'Lắp ráp pin',
    'about.c6': 'Dây chuyền sản xuất',
    'about.loc1': 'Nhà máy',
    'about.loc2': 'Văn phòng',
    'about.loc3': 'Kho Hà Nội',
    'about.wide': 'Nhà xưởng PSI',
    'founders.title': 'Đội ngũ sáng lập đã xây dựng và đưa ra thị trường cả phần cứng lẫn phần mềm',
    'testi.eyebrow': 'Khách hàng nói gì',
    'testi.title': 'Người chạy PSI 69 mỗi ngày.',

    'lines.eyebrow': '04 · Hệ sinh thái',
    'lines.title': 'Bốn dòng sản phẩm, một dòng năng lượng.',
    'lines.move': 'Xe điện chở hàng khung Inox 304 và xe tay ga điện.',
    'lines.charge': 'Sạc siêu nhanh 1,8 kW cho nhiều hãng xe điện.',
    'lines.drive': 'Bộ lưu điện Inverter 2–10 số điện, bù tải cùng máy nổ.',
    'lines.core': 'Nguồn chính xác tới từng milivôn cho máy chủ AI.',
    'lines.count': 'sản phẩm',
    'lines.count1': 'sản phẩm',

    'products.eyebrow': '01 · Sản phẩm',
    'products.title': 'Danh mục sản phẩm 2026',
    'products.all': 'Tất cả',
    'products.price': 'Giá',
    'products.quote': 'Liên hệ báo giá',
    'products.order': 'Đặt mua',
    'products.getquote': 'Nhận báo giá',

    'street.eyebrow': '02 · Trên đường phố',
    'street.title': 'Chạy mỗi ngày, chở mọi thứ.',

    'network.eyebrow': '03 · Mạng lưới trạm sạc',
    'network.title': 'Mở điểm sạc PSI tại cửa hàng của bạn.',
    'network.body':
      'Nhượng quyền trạm sạc PSI: bộ sạc siêu nhanh dùng chung cho nhiều hãng xe, đội ngũ PSI hỗ trợ chọn thiết bị và lắp đặt.',
    'network.b1': 'Sạc 1 giờ được 80% pin',
    'network.b2': 'Tương thích VinFast, Dat Bike, Yadea…',
    'network.b3': 'PSI hỗ trợ lắp đặt sạc',
    'network.cta': 'Đăng ký hợp tác',

    'contact.eyebrow': '06 · Liên hệ',
    'contact.title': 'Cùng PSI chuyển động.',
    'contact.lead': 'Cần tư vấn chọn xe, lắp sạc, hệ lưu điện hay nguồn cho trung tâm dữ liệu? Đội ngũ PSI luôn sẵn sàng.',
    'contact.hotline': 'Hotline / Zalo',
    'contact.email': 'Email',
    'contact.messenger': 'Messenger',
    'contact.chat': 'Nhắn tin ngay',
    'contact.hours': 'Giờ làm việc',
    'contact.h1': 'Thứ 2 – Thứ 6 · 8:00–18:00',
    'contact.h2': 'Thứ 7 · 8:00–12:00',
    'contact.h3': 'Chủ Nhật · Nghỉ',
    'contact.maps': 'Mở bản đồ',

    'footer.rights': 'Bảo lưu mọi quyền.',
  },
  en: {
    'meta.title': 'PSI Technology · Electric cargo vehicles, fast charging, storage & AI power',
    'meta.desc':
      'PSI Technology (PSI LAB VN Co., Ltd.): stainless 304 electric cargo vehicles, 1.8 kW fast chargers, inverter energy storage and GPU power supplies.',
    'nav.skip': 'Skip to content',
    'nav.about': 'About',
    'nav.lines': 'Ecosystem',
    'nav.products': 'Products',
    'nav.network': 'Charging network',
    'nav.contact': 'Contact',
    'nav.call': 'Call',
    'nav.menu': 'Open menu',

    'hero.eyebrow': 'PSI Technology · PSI LAB VN',
    'hero.title': 'One energy platform. From the street to the AI server.',
    'hero.lead': 'Electric cargo vehicles, fast charging, energy storage and AI power, designed and built by PSI in Vietnam.',
    'hero.cta1': 'See products',
    'hero.cta2': 'Message us',
    'usp.1t': 'Singapore × Vietnam',
    'usp.1d': 'A founding team across Hanoi and Singapore',
    'usp.2t': 'In-house R&D, vertically integrated',
    'usp.2d': 'We design, machine and assemble: frame, battery pack and charger',
    'usp.3t': 'AI-first',
    'usp.3d': 'Low capex, high growth',
    'usp.4t': 'Hardware startup, software-strong',
    'usp.4d': 'We build our own web, apps and operations automation',
    'slide.prev': 'Previous photo',
    'slide.next': 'Next photo',
    'slide.go': 'Show photo',
    'hero.scroll': 'Scroll to explore',

    'about.eyebrow': '05 · About PSI',
    'about.title': 'From our factory to the street.',
    'about.body':
      'PSI LAB VN designs, machines and assembles in Vietnam. Our electrical, mechanical and automation engineers own everything from the stainless 304 frame to the battery pack and the charger, so every product is controlled from the workshop to the customer.',
    'about.c1': 'Electrical engineering',
    'about.c2': 'Mechanical engineering',
    'about.c3': 'Automation',
    'about.c4': 'CNC machining',
    'about.c5': 'Battery assembly',
    'about.c6': 'Production line',
    'about.loc1': 'Factory',
    'about.loc2': 'Office',
    'about.loc3': 'Hanoi warehouse',
    'about.wide': 'The PSI workshop',
    'founders.title': 'Founders who have built and shipped hardware + software',
    'testi.eyebrow': 'What riders say',
    'testi.title': 'People who ride the PSI 69 every day.',

    'lines.eyebrow': '04 · Ecosystem',
    'lines.title': 'Four product lines, one flow of energy.',
    'lines.move': 'Stainless 304 electric cargo vehicles and electric scooters.',
    'lines.charge': '1.8 kW ultra-fast charging for many EV brands.',
    'lines.drive': '2–10 kWh inverter storage, load-sharing with a generator.',
    'lines.core': 'Millivolt-accurate power for AI servers.',
    'lines.count': 'products',
    'lines.count1': 'product',

    'products.eyebrow': '01 · Products',
    'products.title': 'Product catalog 2026',
    'products.all': 'All',
    'products.price': 'Price',
    'products.quote': 'Contact for quote',
    'products.order': 'Order',
    'products.getquote': 'Get a quote',

    'street.eyebrow': '02 · On the street',
    'street.title': 'Riding every day, carrying everything.',

    'network.eyebrow': '03 · Charging network',
    'network.title': 'Open a PSI charging point at your store.',
    'network.body':
      'The PSI charging franchise: one fast charger for many EV brands, with the PSI team helping you choose equipment and install it.',
    'network.b1': '80% battery in 1 hour',
    'network.b2': 'Works with VinFast, Dat Bike, Yadea…',
    'network.b3': 'Installation support from PSI',
    'network.cta': 'Become a partner',

    'contact.eyebrow': '06 · Contact',
    'contact.title': 'Move with PSI.',
    'contact.lead': 'Need help choosing a vehicle, installing chargers, storage or data-centre power? The PSI team is ready.',
    'contact.hotline': 'Hotline / Zalo',
    'contact.email': 'Email',
    'contact.messenger': 'Messenger',
    'contact.chat': 'Chat now',
    'contact.hours': 'Working hours',
    'contact.h1': 'Mon – Fri · 8:00–18:00',
    'contact.h2': 'Saturday · 8:00–12:00',
    'contact.h3': 'Sunday · Closed',
    'contact.maps': 'Open in Maps',

    'footer.rights': 'All rights reserved.',
  },
};

export const ADDRESSES = [
  { key: 'about.loc1', text: 'Khu CN An Xá, Ninh Bình' },
  { key: 'about.loc2', text: 'Xã Nam Tiến, Huyện Phú Xuyên, Hà Nội' },
  { key: 'about.loc3', text: '107 P. Linh Đường, Hoàng Liệt, Hà Nội' },
];

export const FOUNDERS = [
  {
    name: 'Tung Nguyen',
    img: 'img/founder-tung-nguyen.webp',
    role: { vi: 'Phần cứng, sản xuất & bán hàng B2C', en: 'Hardware, manufacturing & B2C sales' },
    bio: {
      vi: 'Sáng chế và thương mại hoá xe điện chở hàng PSI 69; điều hành sản xuất và đội phần cứng. Từng là trưởng nhóm triển khai tại Rackspace (Mỹ). Tài chính, ĐH Ngoại thương.',
      en: 'Invented and commercialized the PSI 69 cargo e-bike; runs production and the hardware team. Ex-delivery lead at Rackspace (US). Finance, FTU.',
    },
  },
  {
    name: 'Cuong Phan',
    img: 'img/founder-cuong-phan.webp',
    role: { vi: 'Kỹ thuật phần mềm', en: 'Software engineering' },
    bio: {
      vi: 'Xây dựng web, ứng dụng di động và tự động hoá vận hành của PSI. Nguyên quản lý tư vấn công nghệ tại EY; 7 năm làm việc tại Nhật Bản. CNTT, ĐH Bách khoa Hà Nội.',
      en: 'Builds the PSI web & mobile apps and ops automation. Ex-tech consulting manager at EY; 7 years in Japan. IT, HUST.',
    },
  },
  {
    name: 'Nathan Cheng',
    img: 'img/founder-nathan-cheng.webp',
    role: { vi: 'Tài chính chiến lược & bán hàng B2B · Singapore', en: 'Strategic finance & B2B sales · Singapore' },
    bio: {
      vi: 'Quan hệ nhà đầu tư, kế hoạch tài chính, chiến lược. Kiến trúc sư giải pháp đám mây tại Microsoft (trụ sở Seattle); phụ trách quan hệ nhà đầu tư tại startup 90 Seconds. Kế toán, NTU.',
      en: 'Investor relations, financial planning, strategy. Cloud solution architect at Microsoft (Seattle HQ); ran IR at startup 90 Seconds. Accountancy, NTU.',
    },
  },
  {
    name: 'Quan Trinh',
    img: 'img/founder-quan-trinh.webp',
    role: { vi: 'Sản xuất phần cứng & chiến lược kinh doanh', en: 'Hardware manufacturing & business strategy' },
    bio: {
      vi: 'Nhà sáng lập kiêm CEO LED 111 (đèn công suất cao cho đội tàu cá tại Việt Nam, Indonesia, Philippines) và một công ty kho lạnh quy mô 30 triệu USD với hơn 70 nhân sự. Sở hữu nhà máy lắp ráp hàng loạt.',
      en: 'Founder & CEO of LED 111 (high-power lights for fishing fleets in VN, ID, PH) and a US$30M cold-warehouse company with 70+ staff. Owns a mass-assembly factory.',
    },
  },
];

export const TESTIMONIALS = [
  {
    img: 'img/testimonial-flower-shop.webp',
    quote: {
      vi: 'Có xe PSI 69 mới, tôi giao hoa, cây cảnh, thức ăn thuỷ sản và hàng nặng ngay trong ngày.',
      en: 'With the new PSI 69 bike, I can do same day delivery of flowers and plants, aquatic feed, heavy cargo.',
    },
    who: { vi: 'Chủ cửa hàng nhỏ · Hà Nội', en: 'Small business owner · Hanoi' },
  },
  {
    img: 'img/testimonial-bulky-cargo.webp',
    quote: {
      vi: 'Xe chở hàng PSI 69 đủ chắc để tôi buộc hàng cồng kềnh mà vẫn đi vững suốt cả cung đường.',
      en: 'The PSI 69’s cargo bike is sturdy enough that I can strap down bulky cargo and stay steady the whole route.',
    },
    who: { vi: 'Giao hàng điện máy cồng kềnh · Hà Nội', en: 'Bulky appliance delivery · Hanoi' },
  },
  {
    img: 'img/testimonial-spx.webp',
    quote: {
      vi: 'Từ ngày chuyển sang PSI 69, tôi giao hàng nhanh hơn hẳn… một chuyến chở được nhiều đơn hơn.',
      en: 'Since switching to the PSI 69, my deliveries go a lot faster … I fit more orders on a single trip now.',
    },
    who: { vi: 'Tài xế SPX Express · Hà Nội', en: 'SPX Express driver · Hanoi' },
  },
  {
    img: 'img/testimonial-chemical.webp',
    quote: {
      vi: 'Khung inox không bị ăn mòn kể cả khi hàng rò rỉ ra một chút.',
      en: 'The stainless steel frame doesn’t corrode even when the cargo leaks a little.',
    },
    who: { vi: 'Giao hoá chất · Bắc Giang', en: 'Chemical delivery · Bac Giang' },
  },
  {
    img: 'img/testimonial-seafood.webp',
    quote: {
      vi: 'Xe không gỉ sét, rất hợp vì tôi giao hải sản và sống gần biển.',
      en: 'It doesn’t rust, which is especially great as I deliver seafood and live near the coast.',
    },
    who: { vi: 'Giao hải sản · Quảng Ninh', en: 'Seafood shipper · Quang Ninh' },
  },
  {
    img: 'img/testimonial-ahamove.webp',
    quote: {
      vi: 'Xe cân bằng, vững vàng giữa phố đông và những con ngõ hẹp ở Hà Nội.',
      en: 'It stays balanced and steady through busy Hanoi traffic and narrow alleyways.',
    },
    who: { vi: 'Tài xế Ahamove · Hà Nội', en: 'Ahamove driver · Hanoi' },
  },
];
