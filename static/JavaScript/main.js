/* ---------- Datos de 20 zapatillas (nombre + precio + imagen) ---------- */
    const products = [
      {name:'Kou Runner 01',  img:'static/resources/img/images/zapatillas/adidas_campus.jpg'},
      {name:'Kou Runner 02', img:'static/resources/img/images/zapatillas/adidas_depport.jpg'},
      {name:'Kou Court 03', img:'static/resources/img/images/zapatillas/adidas_depport(other designer).jpg'},
      {name:'Kou Leather 04', img:'static/resources/img/images/zapatillas/adidas_samba.jpg'},
      {name:'Kou Low 05', img:'static/resources/img/images/zapatillas/adidas_superstar.jpg'},
      {name:'Kou High 06', img:'static/resources/img/images/zapatillas/converse_allstar.jpg'},
    {name:'Kou Sport 07', img:'static/resources/img/images/zapatillas/McQUENN.jpg'},
      {name:'Kou Lux 08', img:'static/resources/img/images/zapatillas/N_530_v2(other designer).jpg'},
      {name:'Kou Street 09', img:'static/resources/img/images/zapatillas/N_530_V2(pink).jpg'},
      {name:'Kou Retro 10', img:'static/resources/img/images/zapatillas/N_530(silver).jpg'},
      {name:'Kou Prime 11', img:'static/resources/img/images/zapatillas/N_530(skyblue()).jpg'},
      {name:'Kou Glide 12', img:'static/resources/img/images/zapatillas/N(530 V2).jpg'},
      {name:'Kou Edge 13', img:'static/resources/img/images/zapatillas/nike_AF1.jpg'},
      {name:'Kou Core 14', img:'static/resources/img/images/zapatillas/nike_skate.jpg'},
      {name:'Kou One 15', img:'static/resources/img/images/zapatillas/nike_skate(pink).jpg'},
      {name:'Kou Two 16', img:'static/resources/img/images/zapatillas/nike(beige).jpg'},
      {name:'Kou Neo 17', img:'static/resources/img/images/zapatillas/nike(blue).jpg'},
      {name:'Kou Wave 18', img:'static/resources/img/images/zapatillas/nike(pink).jpg'},
      {name:'Kou Bold 19', img:'static/resources/img/images/zapatillas/nike(silver).jpg'},
      {name:'Kou Select 20', img:'static/resources/img/images/zapatillas/valentino_garvani.jpg'}
    ];

    const productsEl = document.getElementById('products');

    function createCard(p, idx){
      const card = document.createElement('article');
      card.className = 'card';
      card.setAttribute('tabindex','0');
      card.innerHTML = `
        <div class="imgwrap" aria-hidden="true"><img loading="lazy" src="${p.img}" alt="${p.name}"></div>
        <div class="meta">
          <div class="name">${p.name}</div>
          <div class="price muted">$${p.price}</div>
        </div>
      `;
      // click -> quick view
      card.addEventListener('click', ()=> openModal(p));
      card.addEventListener('keydown', (e)=>{
        if(e.key === 'Enter' || e.key === ' ') openModal(p);
      });
      return card;
    }

    // Render cards with slight stagger for reveal
    function renderProducts(list){
      productsEl.innerHTML = '';
      list.forEach((p, i)=>{
        const c = createCard(p, i);
        productsEl.appendChild(c);
        // reveal with small delay
        setTimeout(()=> c.classList.add('visible'), 40 * i);
      });
    }

    // Initial render
    renderProducts(products);

    // Filter & search interactions
    document.getElementById('searchInput').addEventListener('input', (e)=>{
      const q = e.target.value.trim().toLowerCase();
      const filtered = products.filter(p => p.name.toLowerCase().includes(q));
      renderProducts(filtered);
    });

    /* ---------- Modal logic ---------- */
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modalImg');
    const modalName = document.getElementById('modalName');
    const modalPrice = document.getElementById('modalPrice');
    const closeModalBtn = document.getElementById('closeModal');

    function openModal(product){
      modalImg.src = product.img;
      modalImg.alt = product.name;
      modalName.textContent = product.name;
      modalPrice.textContent = '$' + product.price;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden','false');
      // lock body scroll
      document.body.style.overflow = 'hidden';
      // focus for accessibility
      closeModalBtn.focus();
    }

    function closeModal(){
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden','true');
      document.body.style.overflow = '';
    }

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e)=>{
      if(e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape') closeModal();
    });

    /* ---------- Header shrink on scroll (like Gucci header behavior) ---------- */
    const header = document.getElementById('siteHeader');
    const logo = document.getElementById('logo');
    let lastScroll = 0;
    window.addEventListener('scroll', ()=>{
      const sc = window.scrollY;
      if(sc > 50){
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      lastScroll = sc;
    }, {passive:true});

    /* Mobile menu toggle */
    const burger = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobileMenu');
    burger.addEventListener('click', ()=>{
      mobileMenu.classList.toggle('open');
    });
    burger.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' ') burger.click(); });

    /* Smooth anchors*/
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click', (e)=>{
        const href = a.getAttribute('href');
        if(href.length > 1){
          e.preventDefault();
          const target = document.querySelector(href);
          if(target){
            const top = target.getBoundingClientRect().top + window.scrollY - 80; // offset header
            window.scrollTo({top, behavior:'smooth'});
            // close mobile menu if open
            if(window.innerWidth < 820) mobileMenu.style.display = 'none';
          }
        }
      });
    });

    /* Progressive enhancement: lazy reveal on scroll for cards already created */
    // (Already applied class 'visible' with stagger, but ensure any off-screen get visible on intersection)
    const observer = ('IntersectionObserver' in window) ? new IntersectionObserver((entries)=>{
      entries.forEach(ent=>{
        if(ent.isIntersecting){
          ent.target.classList.add('visible');
          observer.unobserve(ent.target);
        }
      });
    }, {threshold: 0.08}) : null;

    document.querySelectorAll('.card').forEach(c=>{
      if(observer) observer.observe(c);
    });

    // Ensure newly rendered cards are observed
    const productsContainerObserver = new MutationObserver((mutations)=>{
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if(node.classList && node.classList.contains('card') && observer) observer.observe(node);
        });
      });
    });
    productsContainerObserver.observe(productsEl, {childList:true});
