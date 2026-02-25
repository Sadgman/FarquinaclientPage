document.addEventListener("DOMContentLoaded", () =>{
        const form = document.querySelector('form');
        if (!form) return;

        form.addEventListener('submit', async  function (event) {
            event.preventDefault();
            const fd = new FormData(form);
            const parts = [];
            const cell = document.getElementById('celular');
            const tel = document.getElementById('telefono');

            if(document.querySelector("#rnc").value.length != 9 && document.querySelector("#rnc").value.length != 11){
                alert("Su RNC o cédula es invalido, por favor ingrese un RNC o cédula válido.")
                return
            }
            if(cell.value.length <= 0){
                if(tel.value.length <= 0){
                    window.alert("Ingrese al menos un número de telefono")
                    return
                }
            }
            for (let [key, value] of fd.entries()) {
                const v = (value || '').toString().trim();
                if (!v) continue;
                if(key.toLocaleLowerCase() == "modo") continue;
                
                parts.push(`${key}: ${v}`);
            }
            if (parts.length === 0) {
                alert('Completa al menos un campo antes de enviar.');
                return;
            }
            //ByAlastor
            const text = parts.join('\n');
            const phone = '18094806925';
            const url = 'https://api.whatsapp.com/send?phone=' + encodeURIComponent(phone) + '&text=' + encodeURIComponent(text);
            window.open(url, '_blank');
        });
})