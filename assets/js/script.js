document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const phoneInput = document.getElementById('phoneInput');
    const nameInput = document.getElementById('nameInput');
    const nameFormat = document.getElementById('nameFormat');
    const suffix = document.getElementById('suffix');
    const phonePreview = document.getElementById('phonePreview');
    const namePreview = document.getElementById('namePreview');
    const finalPreview = document.getElementById('finalPreview');
    const navToggle = document.getElementById('navToggle');
    
    // Dados formatados
    let formattedPhones = [];
    let formattedNames = [];
    
    // Navegação responsiva
    navToggle.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.toggle('show');
    });
    
    // Event Listeners
    document.getElementById('formatPhonesBtn').addEventListener('click', formatPhones);
    document.getElementById('formatNamesBtn').addEventListener('click', formatNames);
    document.getElementById('downloadBtn').addEventListener('click', generateCSV);
    
    // Adicionar listeners para botões de sufixo
    document.querySelectorAll('.suffix-btn').forEach(button => {
        button.addEventListener('click', () => addSuffix(button.dataset.suffix));
    });
    
    // Funções
    function addSuffix(suffixText) {
        suffix.value = (suffix.value + ' ' + suffixText).trim();
    }
    
    function formatPhones() {
        const phones = phoneInput.value.split('\n');
        phonePreview.innerHTML = '';
        formattedPhones = [];
        
        phones.forEach(phone => {
            if (phone.trim()) {
                const formatted = phone.replace(/\D/g, '')
                    .replace(/^(\d{2})(\d)/g, '+55$1$2')
                    .replace(/^(\+55)0/, '$1');
                
                formattedPhones.push(formatted);
                
                const div = document.createElement('div');
                div.className = 'preview-item';
                div.innerHTML = `
                    <span>Original: ${phone}</span>
                    <span class="formatted">Formatado: ${formatted}</span>
                `;
                phonePreview.appendChild(div);
            }
        });
        updateFinalPreview();
    }
    
    function formatNames() {
        const names = nameInput.value.split('\n');
        const format = nameFormat.value;
        const suffixValue = suffix.value;
        namePreview.innerHTML = '';
        formattedNames = [];
        
        names.forEach(name => {
            if (name.trim()) {
                let formatted = name.trim();
                
                switch(format) {
                    case 'upper':
                        formatted = formatted.toUpperCase();
                        break;
                    case 'lower':
                        formatted = formatted.toLowerCase();
                        break;
                    case 'title':
                        formatted = formatted.split(' ')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                            .join(' ');
                        break;
                }
                
                if (suffixValue) {
                    formatted += ` ${suffixValue}`;
                }
                
                formattedNames.push(formatted);
                
                const div = document.createElement('div');
                div.className = 'preview-item';
                div.innerHTML = `
                    <span>Original: ${name}</span>
                    <span class="formatted">Formatado: ${formatted}</span>
                `;
                namePreview.appendChild(div);
            }
        });
        updateFinalPreview();
    }
    
    function updateFinalPreview() {
        finalPreview.innerHTML = '';
        
        const length = Math.max(formattedNames.length, formattedPhones.length);
        
        for (let i = 0; i < length; i++) {
            const div = document.createElement('div');
            div.className = 'preview-item';
            div.innerHTML = `
                <span>${formattedNames[i] || '(sem nome)'}</span>
                <span>${formattedPhones[i] || '(sem telefone)'}</span>
            `;
            finalPreview.appendChild(div);
        }
    }
    
    function generateCSV() {
        const csvData = [];
        const length = Math.max(formattedNames.length, formattedPhones.length);
        
        for (let i = 0; i < length; i++) {
            csvData.push({
                Name: formattedNames[i] || '',
                Phone: formattedPhones[i] || ''
            });
        }
        
        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'contatos_google.csv';
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});