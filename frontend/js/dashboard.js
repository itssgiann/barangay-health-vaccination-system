/* Development hub connection check: no sensitive data rendered. */
(async () => {
 const el = document.getElementById('serverStatus');
 if (!['http:','https:'].includes(location.protocol)) {
   el.textContent='Opened as a local file. Run the Express backend and open /pages/dashboard.html over HTTP.';
   el.classList.add('error');return;
 }
 try {
   const res = await fetch('/api/zones', {headers:{Accept:'application/json'}});
   const ct = res.headers.get('content-type') || '';
   if(res.ok && ct.includes('json')) {
     const data = await res.json();
     el.textContent='API CONNECTED · /api/zones returned '+(Array.isArray(data)?data.length+' zone record(s).':'a response.')+' You may now test assigned modules.';
   } else {
     el.textContent='Server reached but /api/zones returned HTTP '+res.status+'. Check database setup and API route.';
     el.classList.add('error');
   }
 } catch(e) {
   el.textContent='Cannot reach the API on '+location.origin+'. Verify Express is running and use this host/device for all module URLs.';
   el.classList.add('error');
 }
})();
