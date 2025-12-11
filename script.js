// Mostrar/ocultar campo de dificuldade baseado na experiência
document.addEventListener('DOMContentLoaded', function() {
    const experienciaInputs = document.querySelectorAll('input[name="experiencia"]');
    const dificuldadeGroup = document.getElementById('dificuldadeGroup');
    const dificuldadeInput = document.getElementById('dificuldade');

    experienciaInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.value === 'SIM') {
                dificuldadeGroup.style.display = 'flex';
                dificuldadeInput.setAttribute('required', 'required');
            } else {
                dificuldadeGroup.style.display = 'none';
                dificuldadeInput.removeAttribute('required');
                dificuldadeInput.value = '';
            }
        });
    });

    // Validação do formulário
    const form = document.getElementById('mentoriaForm');
    const submitBtn = form.querySelector('.submit-btn');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validar se o campo de dificuldade está preenchido quando necessário
        const experienciaSelecionada = document.querySelector('input[name="experiencia"]:checked');
        if (experienciaSelecionada && experienciaSelecionada.value === 'SIM') {
            if (!dificuldadeInput.value.trim()) {
                alert('Por favor, preencha o campo de dificuldade.');
                dificuldadeInput.focus();
                return;
            }
        }

        // Adicionar estado de loading
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Coletar dados do formulário
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Enviar dados para o webhook através do proxy local
        // Se estiver usando servidor local, use /api/webhook
        // Caso contrário, tenta direto (pode dar erro de CORS)
        const isLocalServer = window.location.protocol === 'http:' || window.location.protocol === 'https:';
        const webhookUrl = isLocalServer 
            ? '/api/webhook' 
            : 'https://n8n.ejss.space/webhook/59f001b1-2dcc-43c3-bb40-5c9f5c0b91d7';
        
        fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            console.log('Status da resposta:', response.status);
            // Aceita qualquer status 2xx como sucesso
            if (response.status >= 200 && response.status < 300) {
                return response.json().catch(() => {
                    // Se não for JSON, considera sucesso mesmo assim
                    return { success: true };
                });
            } else {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }
        })
        .then(result => {
            // Redirecionar para página de agradecimento
            window.location.href = 'obrigado.html';
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao enviar formulário. Por favor, tente novamente.');
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        });
    });

    // Validação em tempo real para campos de texto
    const textInputs = form.querySelectorAll('input[type="text"], input[type="tel"], textarea');
    textInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = 'var(--error)';
            } else if (this.value.trim()) {
                this.style.borderColor = 'var(--success)';
            }
        });

        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = 'var(--border-focus)';
            }
        });
    });
});


// Melhorar UX com animações suaves
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos do formulário
document.querySelectorAll('.form-group').forEach((group, index) => {
    group.style.opacity = '0';
    group.style.transform = 'translateY(20px)';
    group.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
    observer.observe(group);
});

