import { Modal, App, Notice } from 'obsidian';

export class EmailModal extends Modal {
    email: string;
    password: string;
    confirmPassword: string;
    isSignUp: boolean;
    onSubmit: (email: string, password: string, isSignUp: boolean) => void;

    constructor(app: App, onSubmit: (email: string, password: string, isSignUp: boolean) => void) {
        super(app);
        this.onSubmit = onSubmit;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.createEl('h2', { text: 'Authentication' });

        const radioGroup = contentEl.createDiv({ cls: 'radio-group' });

        const signInRadio = radioGroup.createEl('input', { type: 'radio', attr: { name: 'auth-mode', value: 'signin' } });
        signInRadio.id = 'signin-radio';
        const signInLabel = radioGroup.createEl('label', { text: 'Sign In', attr: { for: 'signin-radio' } });
        radioGroup.appendChild(signInLabel);

        const signUpRadio = radioGroup.createEl('input', { type: 'radio', attr: { name: 'auth-mode', value: 'signup' } });
        signUpRadio.id = 'signup-radio';
        const signUpLabel = radioGroup.createEl('label', { text: 'Sign Up', attr: { for: 'signup-radio' } });
        radioGroup.appendChild(signUpLabel);

        const emailInput = contentEl.createEl('input', { type: 'email' });
        emailInput.placeholder = 'Enter your email';

        const passwordInput = contentEl.createEl('input', { type: 'password' });
        passwordInput.placeholder = 'Enter your password';

        const confirmPasswordInput = contentEl.createEl('input', { type: 'password' });
        confirmPasswordInput.placeholder = 'Confirm your password';
        confirmPasswordInput.style.display = 'none'; // Hide initially

        contentEl.appendChild(emailInput);
        contentEl.appendChild(passwordInput);
        contentEl.appendChild(confirmPasswordInput);

        signInRadio.addEventListener('change', () => {
            if (signInRadio.checked) {
                confirmPasswordInput.style.display = 'none';
            }
        });

        signUpRadio.addEventListener('change', () => {
            if (signUpRadio.checked) {
                confirmPasswordInput.style.display = 'block';
            }
        });

        const submitButton = contentEl.createEl('button', { text: 'Submit' });
        submitButton.addEventListener('click', async () => {
            this.email = emailInput.value;
            this.password = passwordInput.value;
            this.confirmPassword = confirmPasswordInput.value;
            this.isSignUp = signUpRadio.checked;

            if (this.isSignUp && this.password !== this.confirmPassword) {
                new Notice('Passwords do not match');
                return;
            }

            const url = this.isSignUp ? 'http://127.0.0.1:8000/backend/signup' : 'http://127.0.0.1:8000/backend/signin';
            const payload = {
                email: this.email,
                password: this.password
            };

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                // Handle the response data as needed
                console.log(data);
            } catch (error) {
                new Notice(`Error: ${error.message}`);
                return;
            }

            this.onSubmit(this.email, this.password, this.isSignUp);
            this.close();
        });

        contentEl.appendChild(submitButton);
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}