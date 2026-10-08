"use client";

import { useMemo, useState } from "react";
import "./globals.css";

type MenuItem = { id:number; name:string; category:string; price:number; desc:string; img:string };
type Combo = { day:string; title:string; hero:string; price:number; includes:string; badge:string; desc:string; image:string; option2?:string };
type BuilderOption = { name:string; price:number };
type CartItem = { name:string; price:number; category:string; customDesc?:string; quantity:number };

const WA = "5547933818516";
const money = (v:number) => `R$ ${v.toFixed(2).replace(".", ",")}`;

const dailyCombos: Combo[] = [
  {day:"TERÇA",title:"BAT BURGUER",hero:"Batman / Gotham City",price:35,includes:"+ Batata P + Refri Lata",badge:"yellow",desc:"O cavaleiro das trevas do sabor! Pão preto de brioche, blend duplo 160g, queijo cheddar bem derretido e molho especial da noite.",image:"https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80"},
  {day:"QUARTA",title:"HEROÍNA CROCANTE",hero:"Mulher Maravilha",price:40,includes:"+ Batata P + Refri Lata",badge:"red",desc:"Poder supremo! Frango empanado ultra crocante, salada coleslaw, queijo prato e maionese de bacon especial.",image:"https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80"},
  {day:"QUINTA",title:"MARTELO DO SABOR & SUPER KIDS",hero:"Thor & Marvel Kids",price:42,includes:"+ Refri 600ml",badge:"blue",option2:"Super Kids por R$ 50,00",desc:"Sabor digno de Asgard! Blend 180g selado no fogo, bacon artesanal super crocante e molho barbecue defumado.",image:"https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80"},
  {day:"SEXTA",title:"TROPICAL DEADPOOL & SEGREDO DA PANTERA",hero:"Deadpool & Pantera Negra",price:44.9,includes:"+ Refri 600ml",badge:"red",option2:"Segredo da Pantera por R$ 61,90",desc:"Combinação anti-herói irresistível! Geleia de pimenta com abacaxi grelhado, bacon e cheddar cremoso.",image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"},
  {day:"SÁBADO",title:"SPIDER BURGUER & RAVENA",hero:"Homem-Aranha & Ravena",price:72,includes:"+ Batata P + Refri 2 Litros",badge:"red",desc:"Sensação de aranha garantida! Combo completo para dividir ou encarar a fome sozinho com refri de 2L.",image:"https://images.unsplash.com/photo-1594212699903-ec8a3eca50f6?auto=format&fit=crop&w=800&q=80"},
  {day:"DOMINGO",title:"HULK POWER, WOLVERINE & CAPITÃO SUPREMO",hero:"Trinca de Titãs",price:145.9,includes:"+ Batata P + Refri 2 Litros",badge:"green",desc:"O MEGA COMBO PARA A FAMÍLIA OU GALERA DOS QUADRINHOS! 3 grandes burgers selecionados + batata grande + refri 2L.",image:"https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=800&q=80"}
];

const menuItems:MenuItem[] = [
  {id:1,name:"Capitão América Supremo",category:"burgers",price:45.9,desc:"Blend duplo 180g, muçarela empanada crocante, bacon caramelizado & maionese da casa.",img:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"},
  {id:2,name:"Bat Burguer",category:"burgers",price:35,desc:"Pão preto brioche, blend 160g, cheddar duplo cremoso e cebola caramelizada no shoyu.",img:"https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80"},
  {id:3,name:"Hulk Power Smash",category:"burgers",price:38.9,desc:"3x Smash blend 70g bem selados com crosta, queijo prato triplo e molho verde da casa.",img:"https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80"},
  {id:4,name:"Tropical Deadpool",category:"burgers",price:44.9,desc:"Blend 180g, geleia de pimenta leve, abacaxi grelhado na manteiga e muito bacon.",img:"https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80"},
  {id:5,name:"Combo Liga da Justiça",category:"combos",price:72,desc:"2 Burgers clássicos + Batata frita tamanho P + Refrigerante 2 Litros.",img:"https://images.unsplash.com/photo-1594212699903-ec8a3eca50f6?auto=format&fit=crop&w=600&q=80"},
  {id:6,name:"Batata Frita Kryptonita",category:"porcoes",price:28,desc:"Batata palito crocante coberta com creme cheddar e bacon artesanal picado.",img:"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&q=80"},
  {id:7,name:"Nuggets do Flash",category:"porcoes",price:24,desc:"10 unidades de nuggets empanados de frango com molho barbecue da casa.",img:"https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80"},
  {id:8,name:"Refrigerante Lata 350ml",category:"bebidas",price:7,desc:"Coca-Cola, Coca Zero, Guaraná Antarctica ou Sprite.",img:"https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80"},
  {id:9,name:"Refrigerante 2 Litros",category:"bebidas",price:14,desc:"Coca-Cola ou Guaraná Antarctica 2L para dividir com a equipe.",img:"https://images.unsplash.com/photo-1581006852262-e4307cf6283a?auto=format&fit=crop&w=600&q=80"}
];

const builder = {
  pao:[{name:"Brioche com Gergelim",price:5},{name:"Pão Preto Gotham",price:6},{name:"Pão Australiano",price:6}],
  carne:[{name:"Blend Bovino 180g",price:16},{name:"2x Smash 80g",price:15},{name:"Frango Empanado Crocante",price:14}],
  queijo:[{name:"Cheddar Inglês",price:5},{name:"Muçarela Empanada",price:9},{name:"Queijo Prato",price:4}],
  adicionais:[{name:"Bacon Crocante",price:6},{name:"Cebola Caramelizada",price:4},{name:"Salada Completa",price:3}],
  molho:[{name:"Maionese Heroic",price:3},{name:"Barbecue Defumado",price:3},{name:"Geleia de Pimenta",price:4}]
};

function Icon({children}:{children:string}) { return <span aria-hidden>{children}</span>; }

export default function Home() {
  const [comboIndex,setComboIndex] = useState(0);
  const [category,setCategory] = useState("all");
  const [cart,setCart] = useState<CartItem[]>([]);
  const [drawer,setDrawer] = useState(false);
  const [name,setName] = useState("");
  const [address,setAddress] = useState("");
  const [custom,setCustom] = useState({
    pao:builder.pao[0], carne:builder.carne[0], queijo:builder.queijo[0],
    adicionais:[builder.adicionais[0]] as BuilderOption[], molho:builder.molho[0]
  });

  const filtered = category==="all" ? menuItems : menuItems.filter(x=>x.category===category);
  const customTotal = custom.pao.price+custom.carne.price+custom.queijo.price+custom.molho.price+custom.adicionais.reduce((s,x)=>s+x.price,0);
  const cartCount = cart.reduce((s,x)=>s+x.quantity,0);
  const cartTotal = cart.reduce((s,x)=>s+x.price*x.quantity,0);
  const combo = dailyCombos[comboIndex];

  function add(item:Omit<CartItem,"quantity">) {
    setCart(prev=>{
      const i=prev.findIndex(x=>x.name===item.name && x.customDesc===item.customDesc);
      if(i>=0) return prev.map((x,j)=>j===i?{...x,quantity:x.quantity+1}:x);
      return [...prev,{...item,quantity:1}];
    });
    setDrawer(true);
  }
  function qty(i:number,delta:number) {
    setCart(prev=>prev.map((x,j)=>j===i?{...x,quantity:x.quantity+delta}:x).filter(x=>x.quantity>0));
  }
  function setSingle(key:"pao"|"carne"|"queijo"|"molho", opt:BuilderOption) {
    setCustom(c=>({...c,[key]:opt}));
  }
  function toggleAdditional(opt:BuilderOption) {
    setCustom(c=>({...c,adicionais:c.adicionais.some(x=>x.name===opt.name)?c.adicionais.filter(x=>x.name!==opt.name):[...c.adicionais,opt]}));
  }
  function checkout() {
    if(!cart.length) { alert("Adicione ao menos um item ao pedido antes de finalizar!"); return; }
    let msg=`*⚡ NOVO PEDIDO - HEROIC BURGUER ⚡*\\n\\n*Cliente:* ${name.trim()||"Cliente Heroico"}\\n*Endereço:* ${address.trim()||"Retirada no QG ou A Combinar"}\\n\\n*ITENS DO PEDIDO:*\\n`;
    cart.forEach((x,i)=>{msg+=`${i+1}. *${x.quantity}x ${x.name}* - ${money(x.price*x.quantity)}\\n`; if(x.customDesc) msg+=`   _${x.customDesc}_\\n`;});
    msg+=`\\n*TOTAL:* ${money(cartTotal)}\\n\\n_Aguardando confirmação e chave PIX para pagamento!_`;
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`,"_blank");
  }

  return <>
    <div className="ticker">⚡ O HAMBÚRGUER MAIS ÉPICO DE JOINVILLE SC　 ⚡ PEÇA PELO WHATSAPP (47) 93381-8516　 ⚡ TERÇA A DOMINGO DAS 18H ÀS 23H30　 ⚡ INGREDIENTES FRESCOS & BLENDS ESPECIAIS</div>

    <header className="header">
      <a href="#" className="brand"><div className="logo">✦<b>HEROIC</b><small>BURGUER</small></div><div className="brandText"><strong>HEROIC <em>BURGUER</em></strong><small>Hamburgueria Pop Art</small></div></a>
      <nav><a href="#combos">COMBOS DO DIA</a><a href="#cardapio">CARDÁPIO</a><a href="#laboratorio">MONTE O SEU</a><a href="#sobre">SEGREDOS</a><a href="#localizacao">NOSSO QG</a></nav>
      <div className="headActions"><button className="btn blue" onClick={()=>setDrawer(true)}>🛒 <span>SEU PEDIDO</span> <b className="badge">{cartCount}</b></button><a className="btn yellow desktopOnly" href={`https://wa.me/${WA}`} target="_blank">💬 PEDIR AGORA</a></div>
    </header>

    <main>
      <section className="hero sectionPattern">
        <div className="container heroGrid">
          <div className="heroCopy">
            <span className="sticker">🎭 SUPER FOME? NÓS TEMOS A SOLUÇÃO!</span>
            <h1>SABOR DE <mark>OUTRO PLANETA</mark> NA SUA MESA!</h1>
            <p>Blends suculentos grelhados no fogo, queijo derretido de verdade, molhos artesanais secretos e pão selado na manteiga. Experimente a verdadeira energia dos quadrinhos!</p>
            <div className="heroBtns"><a className="btn yellow big" href="#combos">⚡ VER COMBOS ESPECIAIS</a><a className="btn dark big" href="#laboratorio">⚗ MONTE SEU BURGER</a></div>
            <div className="benefits"><div>🔥<b>100% ARTESANAL</b></div><div>🚚<b>ENTREGA RÁPIDA</b></div><div>⭐<b>TOP RATED IRIRIÚ</b></div></div>
          </div>
          <div className="heroCard"><span className="burst">O MAIS PEDIDO!</span><img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80" alt="Heroic Special Burger"/><div className="feature"><div><h3>CAPITÃO AMÉRICA SUPREMO</h3><p>Blend duplo 180g, muçarela empanada crocante, bacon caramelizado & maionese da casa.</p></div><b>{money(45.9)}</b></div><button className="btn yellow full" onClick={()=>add({name:"Capitão América Supremo",price:45.9,category:"burgers"})}>＋ ADICIONAR AO PEDIDO</button></div>
        </div>
      </section>

      <section id="combos" className="section darkSection"><div className="container">
        <div className="sectionTitle"><span>📅 AGENDA DOS HERÓIS</span><h2>COMBOS ESPECIAIS DE <mark>TERÇA A DOMINGO</mark></h2><p>Escolha o dia da semana e descubra os poderes gastronômicos em promoção!</p></div>
        <div className="tabs">{dailyCombos.map((x,i)=><button key={x.day} className={i===comboIndex?"active":""} onClick={()=>setComboIndex(i)}>{x.day}</button>)}</div>
        <div className="comboCard"><div><span className={`comboBadge ${combo.badge}`}>COMBO DE {combo.day}</span><h3>{combo.title}</h3><h4>🎭 TEMÁTICA: {combo.hero}</h4><p>{combo.desc}</p><div className="comboInfo"><div><small>INCLUI NO COMBO:</small><strong>{combo.includes}</strong>{combo.option2&&<small className="yellowText">* {combo.option2}</small>}</div><b>{money(combo.price)}</b></div><button className="btn yellow full big" onClick={()=>add({name:`Combo ${combo.day} - ${combo.title}`,price:combo.price,category:"combos"})}>🛒 QUERO ESTE COMBO DE {combo.day}</button></div><img src={combo.image} alt={combo.title}/></div>
      </div></section>

      <section id="cardapio" className="section sectionPattern"><div className="container">
        <div className="menuHeader"><div><span className="redPill">🍴 NOSSO ARSENAL</span><h2>CARDÁPIO <mark>COMPLETO</mark></h2></div><div className="filters">{[["all","TODOS"],["burgers","BURGERS"],["combos","COMBOS"],["porcoes","BATATAS & ACOMP."],["bebidas","BEBIDAS"]].map(([k,l])=><button key={k} className={category===k?"active":""} onClick={()=>setCategory(k)}>{l}</button>)}</div></div>
        <div className="menuGrid">{filtered.map(item=><article className="menuCard" key={item.id}><div className="imageWrap"><img src={item.img} alt={item.name}/><span>{money(item.price)}</span></div><h3>{item.name}</h3><p>{item.desc}</p><button className="btn yellow full" onClick={()=>add({name:item.name,price:item.price,category:item.category})}>＋ ADICIONAR</button></article>)}</div>
      </div></section>

      <section id="laboratorio" className="section darkSection"><div className="container"><div className="sectionTitle"><span className="bluePill">⚗ MONTE O SEU BURGER</span><h2>LABORATÓRIO DO <mark>HERÓI</mark></h2><p>Crie sua própria combinação épica passo a passo e veja o preço e resultado em tempo real!</p></div>
        <div className="builderGrid"><div className="builderPanel">
          {(["pao","carne","queijo","molho"] as const).map((key,idx)=><div className="builderStep" key={key}><h3><i>{idx+1}</i>{key==="pao"?"ESCOLHA O PÃO:":key==="carne"?"CARNE / BLEND:":key==="queijo"?"QUEIJO ESPECIAL:":"MOLHO SECRETO DO HERÓI:"}</h3><div className="optionGrid">{builder[key].map(opt=><button key={opt.name} className={custom[key].name===opt.name?"selected":""} onClick={()=>setSingle(key,opt)}>{opt.name}<small>+{money(opt.price)}</small></button>)}</div></div>)}
          <div className="builderStep"><h3><i>4</i>ADICIONAIS & SALADA:</h3><div className="optionGrid">{builder.adicionais.map(opt=><button key={opt.name} className={custom.adicionais.some(x=>x.name===opt.name)?"selected":""} onClick={()=>toggleAdditional(opt)}>{opt.name}<small>+{money(opt.price)}</small></button>)}</div></div>
        </div>
        <aside className="preview"><span className="exclusive">CRIAÇÃO EXCLUSIVA</span><h3>SUA CRIAÇÃO ÉPICA</h3><div className="burgerMock"><div>🍞 PÃO TOPO</div><div>{custom.molho.name}</div><div>{custom.queijo.name}</div><div>🥩 {custom.carne.name}</div><div>🍞 PÃO BASE</div></div><div className="summary"><b>Ingredientes selecionados:</b><ul><li>Pão: {custom.pao.name}</li><li>Carne: {custom.carne.name}</li><li>Queijo: {custom.queijo.name}</li><li>Adicionais: {custom.adicionais.map(x=>x.name).join(", ")||"Nenhum"}</li><li>Molho: {custom.molho.name}</li></ul></div><div className="totalRow"><div><small>VALOR TOTAL</small><strong>{money(customTotal)}</strong></div><button className="btn yellow big" onClick={()=>add({name:"Burger Personalizado Heróico",price:customTotal,category:"Custom",customDesc:`${custom.pao.name}, ${custom.carne.name}, ${custom.queijo.name}, ${custom.molho.name}`})}>🛒 ADICIONAR</button></div></aside></div>
      </div></section>

      <section id="sobre" className="section sectionPattern"><div className="container"><div className="sectionTitle"><span>🛡 NOSSO SEGREDO</span><h2>POR QUE A <mark>HEROIC</mark> É DIFERENTE?</h2></div><div className="features"><article>🥩<h3>CARNE FRESCA & MOÍDA NO DIA</h3><p>Nada de carne congelada industrializada. Nossos blends são preparados diariamente com cortes nobres selecionados para garantir máxima suculência.</p></article><article>🧀<h3>QUEIJO DERRETIDO DE VERDADE</h3><p>Utilizamos queijos de alta qualidade grelhados na chapa junto com o burger para criar aquela crostinha crocante irresistível e cremosidade incomparável.</p></article><article>🌶️<h3>MOLHOS ARTESANAIS SECRETOS</h3><p>Maionese temperada da casa, molho Heroic de pimentas suaves, barbecue defumado artesanal e muito mais. Receitas exclusivas do nosso QG.</p></article></div><div className="process"><h3>O PASSO A PASSO DA SUA SUPER REFEIÇÃO:</h3><div>{["SELEÇÃO & MOAGEM","MODELAGEM MANUAL","SELAGEM NA CHAPA ALTA","MONTAGEM ÉPICA","ENTREGA NO SEU QG!"].map((x,i)=><span key={x}><b>0{i+1}</b>{x}</span>)}</div></div></div></section>

      <section id="localizacao" className="section darkSection"><div className="container location"><div><span className="redPill">📍 QUARTEL GENERAL</span><h2>VENHA CONHECER NOSSO <mark>QG EM JOINVILLE</mark></h2><p>Sinta o clima pop art ao vivo ou peça no conforto da sua casa!</p><div className="contact"><p>📌 <b>Endereço:</b><br/>R. Dr. Júlio de Mesquita Filho, 168 - Iririú, Joinville - SC</p><p>🕒 <b>Horário de Funcionamento:</b><br/>Terça a Domingo: 18h às 23h30</p><p>📞 <b>Atendimento WhatsApp:</b><br/>(47) 93381-8516</p></div><div className="heroBtns"><a className="btn green big" href={`https://wa.me/${WA}`} target="_blank">💬 CONVERSAR NO ZAP</a><a className="btn blue big" href="https://maps.google.com/?q=R.+Dr.+Júlio+de+Mesquita+Filho,+168+-+Iririú,+Joinville+-+SC" target="_blank">🗺 COMO CHEGAR</a></div></div><div className="map"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3578.528399127521!2d-48.818451!3d-26.276856" loading="lazy"/></div></div></section>
    </main>

    <footer><b>HEROIC BURGUER</b> - JOINVILLE <span>© 2026 Heroic Burguer Artesanal Pop Art. Todos os direitos reservados.</span><a href={`https://wa.me/${WA}`}>💬</a></footer>

    {drawer && <div className="drawerBackdrop" onClick={()=>setDrawer(false)}><aside className="drawer" onClick={e=>e.stopPropagation()}><div className="drawerHead"><h2>🛒 SEU PEDIDO HERÓICO</h2><button onClick={()=>setDrawer(false)}>×</button></div><div className="cartItems">{cart.length===0?<div className="empty">👻<br/>SEU CARRINHO ESTÁ VAZIO!</div>:cart.map((x,i)=><div className="cartItem" key={`${x.name}-${x.customDesc||""}`}><div><h3>{x.name}</h3>{x.customDesc&&<small>{x.customDesc}</small>}<b>{money(x.price)}</b></div><div className="qty"><button onClick={()=>qty(i,-1)}>-</button><span>{x.quantity}</span><button onClick={()=>qty(i,1)}>+</button></div></div>)}</div><div className="checkout"><input value={name} onChange={e=>setName(e.target.value)} placeholder="Seu Nome completo..."/><input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Endereço de entrega (Rua, Bairro, Nº)..."/><div className="cartTotal"><span>TOTAL:</span><b>{money(cartTotal)}</b></div><button className="btn green full big" onClick={checkout}>💬 FINALIZAR NO WHATSAPP</button></div></aside></div>}
  </>;
}
