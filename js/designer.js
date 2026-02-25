document.addEventListener("DOMContentLoaded", async () =>{
    const data = await (await fetch('data/data.json')).json()
    const tel = document.getElementById('telefono');
    const rnc = document.getElementById('rnc');
    const celular = document.getElementById('celular');
    const rs = document.getElementById("rs");
    const inputs = document.querySelectorAll('input')
    const modo = document.getElementById('modo')
    const zona = document.querySelector('label[for="zona"]')
    const nombreP = document.getElementById('nombrePropietario')
    const maxLengthRNC = rnc.maxLength

    async function rncevaluate(){
        rnc.value = rnc.value.replaceAll(/\D/g, "");
        if(rnc.value.length == 11 && await fetch(`https://api.digital.gob.do/v3/cedulas/${rnc.value}/validate`)){
            fetch(`https://api.digital.gob.do/v3/cedulas/${rnc.value}/info/basic`).then(e => e.json()).then((e)=>{
                nombreP.value = `${e.payload.names} ${e.payload.firstSurname} ${e?.payload?.secondSurname? e.payload.secondSurname : ''}`;
            })
        }
    }

    for(let i=0; i<inputs.length; i++){
        inputs[i].addEventListener('input',(element)=>{
            element.target.value  = element.target.value.replace('  ', ' ')
        })
    }

    const telefonos = [tel, celular];
    modo.addEventListener("change", ()=>{
        if(modo.value == 'Avanzado'){
            rnc.removeEventListener("input", rncevaluate)
            rnc.maxLength = 14
            zona.insertAdjacentHTML("afterend", `
                <label id="Regimp">Regimen Impositivo: 
                    <select name="Regimen Impositivo"></select>
                </label>
                <label id="tipoCli">Tipo de cliente: 
                    <select name="TipoCliente">
                        <option>Corporativo</option>
                        <option>Detalle</option>
                    </select>
                </label>
                `
            )
            for(let regimp of data.regimp){
                const option = document.createElement('option');
                option.value = regimp;
                option.textContent = regimp;
                document.querySelector("#Regimp select").appendChild(option);
            }
        }else{
            rnc.maxLength = maxLengthRNC
            rncevaluate()
            rnc.addEventListener("input", rncevaluate)
            document.getElementById("Regimp").remove()
            document.getElementById("tipoCli").remove()
        }
    })
    rnc.addEventListener("input", rncevaluate)
    rs.addEventListener("input", ()=>{
        rs.value = rs.value.toUpperCase();

    })
    telefonos.forEach((tel)=>{
        tel.addEventListener('input', () => {
            tel.value = tel.value.replaceAll(/(\s|\W|[a-zA-z]|\)\(|)/g, '');
            if(tel.value.startsWith("1")) tel.value = tel.value.slice(1);
            const validatePrefix = ["809", "849", "829"]
            validatePrefix.forEach((prefix)=>{
                if(tel.value.includes(prefix)){
                    tel.value =  tel.value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
                }
            });
            if(telefonos[0].value == telefonos[1].value) telefonos[1].value = '';
        });
    });
    document.getElementById("direccion").addEventListener("input", ()=>{
        let direc = document.querySelector("#direccion")
        const validaciones = {calle:"C/", avenida: "AV.", numero: "#", esquina: "Esq.", autopista: "Aut."}
        Object.keys(validaciones).forEach((val, count) => {
            if(direc.value.toLocaleLowerCase().includes(val)){
                direc.value = direc.value.replaceAll(RegExp(val, 'gi'), Object.values(validaciones)[count]);
            };
        });
    });
    for(let zona of data.zonas){
        const option = document.createElement('option');
        option.value = zona.toUpperCase();
        option.textContent = zona.toUpperCase();
        document.getElementById('zona').appendChild(option);
    }
})