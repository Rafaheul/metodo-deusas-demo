// Página inicial premium (par do premium.css). Só mexe na aparência: não muda resposta, mapa nem compra.
// Quem pediu "reduzir movimento" no aparelho vê tudo parado e aceso.
(function () {
  var calma = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var observa = 'IntersectionObserver' in window;
  if (!calma && observa) document.documentElement.classList.add('pr-anima');

  document.addEventListener('DOMContentLoaded', function () {
    var home = document.getElementById('home-view');
    if (!home || !home.classList.contains('pr')) return;
    var cabeca = document.querySelector('.site-header');

    // cabeçalho: transparente sobre a abertura, papel depois de rolar
    function rolou() { if (cabeca) cabeca.classList.toggle('rolou', scrollY > 40 || home.hidden); }
    addEventListener('scroll', rolou, { passive: true }); rolou();
    new MutationObserver(rolou).observe(home, { attributes: true, attributeFilter: ['hidden'] });

    // ---------- panteão: a luz passa de deusa em deusa ----------
    var panteao = document.getElementById('pr-panteao');
    var deusas = panteao ? [].slice.call(panteao.querySelectorAll('.pr-deusa')) : [];
    var nome = panteao && panteao.querySelector('.pr-panteao__nome');
    var ordem = [3, 4, 2, 5, 1, 6, 0];   // do centro para as pontas, alternando os lados
    var passo = 0, atual = 3, timer = 0, heroVisivel = true, pausado = false;
    function acende(i) {
      atual = i;
      deusas.forEach(function (d, k) { d.classList.toggle('is-luz', k === i); d.setAttribute('aria-pressed', k === i); });
      var d = deusas[i];
      nome.innerHTML = '<i lang="el">' + (d.dataset.grego || '') + '</i><b>' + d.dataset.nome + '</b><span>' + d.dataset.cap + '</span>';
      if (!calma) { nome.classList.remove('troca'); void nome.offsetWidth; nome.classList.add('troca'); }
    }
    function agenda() {
      clearTimeout(timer);
      if (calma || pausado || !heroVisivel || document.hidden) return;
      timer = setTimeout(function () { passo = (passo + 1) % ordem.length; acende(ordem[passo]); agenda(); }, 3200);
    }
    if (deusas.length) {
      acende(3);
      deusas.forEach(function (d, k) {
        d.addEventListener('click', function () { pausado = true; acende(k); clearTimeout(timer); setTimeout(function () { pausado = false; passo = Math.max(0, ordem.indexOf(k)); agenda(); }, 9000); });
        d.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { pausado = true; clearTimeout(timer); acende(k); } });
        d.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { pausado = false; passo = Math.max(0, ordem.indexOf(k)); agenda(); } });
      });
      document.addEventListener('visibilitychange', agenda);
      if (observa) new IntersectionObserver(function (e) { heroVisivel = e[0].isIntersecting; agenda(); }, { threshold: .2 }).observe(panteao);
      setTimeout(agenda, 1800);
    }

    // ---------- poeira dourada subindo na abertura ----------
    // (vale para a abertura e para a revelação da regente; cada tela tem a sua poeira)
    function poeira(tela) {
      if (calma || !tela.getContext || tela.dataset.poeira) return; tela.dataset.poeira = '1';
      var ctx = tela.getContext('2d'), graos = [], larg = 0, alt = 0, ligado = true, dpr = Math.min(2, devicePixelRatio || 1);
      function novo(inicio) { return { x: Math.random() * larg, y: inicio ? Math.random() * alt : alt + 10, r: .6 + Math.random() * 1.8, v: .15 + Math.random() * .45, f: Math.random() * 6.28, a: .25 + Math.random() * .55 }; }
      function mede() {
        var r = tela.getBoundingClientRect(); larg = r.width; alt = r.height; tela.width = larg * dpr; tela.height = alt * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        var n = Math.round(Math.min(70, larg / 18)); graos = []; for (var i = 0; i < n; i++) graos.push(novo(true));
      }
      mede();
      if (window.ResizeObserver) new ResizeObserver(mede).observe(tela); else addEventListener('resize', mede);
      (function quadro() {
        if (ligado && larg) {
          ctx.clearRect(0, 0, larg, alt);
          graos.forEach(function (g, k) {
            g.y -= g.v; g.f += .012; var x = g.x + Math.sin(g.f) * 14;
            if (g.y < -10) graos[k] = novo(false);
            ctx.globalAlpha = g.a * (0.6 + 0.4 * Math.sin(g.f * 2));
            ctx.fillStyle = '#f0dca6'; ctx.beginPath(); ctx.arc(x, g.y, g.r, 0, 6.283); ctx.fill();
          });
        }
        if (tela.isConnected) requestAnimationFrame(quadro);
      })();
      if (observa) new IntersectionObserver(function (e) { ligado = e[0].isIntersecting; }).observe(tela);
    }
    window.prPoeira = poeira; // o resultado (app.js) usa na capa da regente
    [].slice.call(document.querySelectorAll('.pr-poeira')).forEach(poeira);

    // ---------- no computador, o panteão acompanha o mouse de leve ----------
    if (panteao && !calma && matchMedia('(hover:hover) and (pointer:fine)').matches) {
      var fila = panteao.querySelector('.pr-panteao__fila'), templo = panteao.querySelector('.pr-panteao__templo'), pedido = 0, pos = null;
      var hero = document.querySelector('.pr-hero');
      hero.addEventListener('pointermove', function (e) { pos = e; if (!pedido) pedido = requestAnimationFrame(move); });
      hero.addEventListener('pointerleave', function () { pos = null; if (!pedido) pedido = requestAnimationFrame(move); });
      function move() {
        pedido = 0;
        if (!pos) { fila.style.transform = ''; templo.style.translate = ''; return; }
        var x = pos.clientX / innerWidth - .5, y = pos.clientY / innerHeight - .5;
        fila.style.transition = 'transform 1.2s cubic-bezier(.22,1,.36,1)';
        fila.style.transform = 'translate(' + (x * 14).toFixed(1) + 'px,' + (y * 6).toFixed(1) + 'px)';
        templo.style.translate = (x * -10).toFixed(1) + 'px ' + (y * -4).toFixed(1) + 'px';
      }
    }

    // ---------- entradas ao rolar ----------
    var blocos = [].slice.call(home.querySelectorAll('[data-pr], .pr-sete__trilho'));
    var cartas = [].slice.call(home.querySelectorAll('.pr-carta'));
    cartas.forEach(function (c, i) { c.style.setProperty('--pr-i', i); });
    // irmãos que entram juntos sobem em cascata
    blocos.forEach(function (b) {
      var irmaos = [].slice.call(b.parentNode.children).filter(function (x) { return x.hasAttribute('data-pr'); });
      if (irmaos.length > 1) b.style.setProperty('--pr-i', irmaos.indexOf(b));
    });
    if (observa && !calma) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('pr-vis'); io.unobserve(e.target); } });
      }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
      blocos.forEach(function (b) { io.observe(b); });
    } else blocos.forEach(function (b) { b.classList.add('pr-vis'); });

    // ---------- palco das frases: a rolagem escolhe a cena (frase + deusa + coluna) ----------
    var frases = [].slice.call(home.querySelectorAll('.pr-frase'));
    var trilhoP = home.querySelector('.pr-palco__trilho');
    var imgsP = [].slice.call(home.querySelectorAll('.pr-palco__img'));
    var colsP = [].slice.call(home.querySelectorAll('.pr-palco__colunas li'));
    var cena = -1;
    function palco() {
      if (calma || !observa || !trilhoP) return;
      var r = trilhoP.getBoundingClientRect(), total = r.height - innerHeight;
      var prog = total > 0 ? Math.min(.999, Math.max(0, -r.top / total)) : 0;
      var i = Math.floor(prog * frases.length);
      if (i === cena) return;
      cena = i;
      frases.forEach(function (f, k) { f.classList.toggle('is-on', k === i); f.classList.toggle('is-sai', k < i); });
      imgsP.forEach(function (m, k) { m.classList.toggle('is-on', k === i); if (Math.abs(k - i) <= 1) m.loading = 'eager'; });
      colsP.forEach(function (c, k) { c.classList.toggle('is-on', k === i); c.classList.toggle('is-feita', k < i); });
    }

    // conferência pela rolagem: move o palco e, se algum navegador não avisar a entrada
    // de um bloco, ele aparece mesmo assim (nada pode ficar invisível)
    var pedidoR = 0;
    function confere() {
      pedidoR = 0;
      if (home.hidden) return;
      var h = innerHeight;
      palco();
      blocos.forEach(function (b) {
        if (!b.classList.contains('pr-vis') && b.getBoundingClientRect().top < h * .9) b.classList.add('pr-vis');
      });
    }
    addEventListener('scroll', function () { if (!pedidoR) pedidoR = requestAnimationFrame(confere); }, { passive: true });
    addEventListener('resize', confere);
    confere();

    // ---------- trilho das sete: setas ----------
    var trilho = document.getElementById('pr-trilho');
    home.querySelectorAll('[data-pr-trilho]').forEach(function (b) {
      b.addEventListener('click', function () {
        var c = trilho.querySelector('.pr-carta'); var passoT = c ? c.getBoundingClientRect().width + 22 : 300;
        trilho.scrollBy({ left: Number(b.getAttribute('data-pr-trilho')) * passoT, behavior: calma ? 'auto' : 'smooth' });
      });
    });
    // virar a carta: tocar em qualquer parte dela vira (o app.js troca .turned; o CSS gira)
    cartas.forEach(function (c) {
      var b = c.querySelector('.god-turn'); if (!b) return;
      var frente = c.querySelector('.pr-carta__frente'), verso = c.querySelector('.pr-carta__verso');
      b.addEventListener('click', function () {
        var virada = c.classList.contains('turned');
        if (frente) frente.setAttribute('aria-hidden', virada);
        if (verso) verso.setAttribute('aria-hidden', !virada);
      });
      c.addEventListener('click', function (e) {
        if (e.target.closest('button, a')) return;
        b.click();
      });
    });

    // ---------- botão fixo do celular: depois da abertura, some no convite final ----------
    var fixo = document.getElementById('pr-fixo'), heroEl = document.querySelector('.pr-hero'), final = document.getElementById('pr-final');
    if (fixo && observa) {
      var passouHero = false, vendoFinal = false;
      function mostra() { fixo.classList.toggle('on', passouHero && !vendoFinal && !home.hidden); }
      new IntersectionObserver(function (e) { passouHero = !e[0].isIntersecting && e[0].boundingClientRect.top < 0; mostra(); }).observe(heroEl);
      new IntersectionObserver(function (e) { vendoFinal = e[0].isIntersecting; mostra(); }, { threshold: .15 }).observe(final);
    }
  });
})();
