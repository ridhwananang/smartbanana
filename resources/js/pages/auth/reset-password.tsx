import { Form, Head } from '@inertiajs/react';
import InputLabel from '@/components/InputLabel';
import TextInput from '@/components/TextInput';
import InputError from '@/components/InputError';
import PrimaryButton from '@/components/PrimaryButton';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
};

export default function ResetPassword({ token, email }: Props) {
    return (
        <>
            <Head title="Atur Ulang Kata Sandi" />

            <Form
                {...update.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
                className="space-y-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-2">
                            <InputLabel htmlFor="email" value="Alamat Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                className="block w-full opacity-65 cursor-not-allowed bg-slate-50 dark:bg-neutral-900 border-slate-200 dark:border-neutral-800"
                                readOnly
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="space-y-2">
                            <InputLabel htmlFor="password" value="Kata Sandi Baru" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                autoComplete="new-password"
                                className="block w-full focus:border-amber-500 focus:ring-amber-500"
                                isFocused={true}
                                required
                                placeholder="Min. 8 karakter"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="space-y-2">
                            <InputLabel
                                htmlFor="password_confirmation"
                                value="Konfirmasi Kata Sandi Baru"
                            />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                autoComplete="new-password"
                                className="block w-full focus:border-amber-500 focus:ring-amber-500"
                                required
                                placeholder="Ulangi kata sandi baru"
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <div className="pt-2">
                            <PrimaryButton
                                type="submit"
                                className="flex w-full justify-center text-center text-xs font-black tracking-widest uppercase"
                                disabled={processing}
                            >
                                {processing ? 'Memproses...' : 'Atur Ulang Kata Sandi'}
                            </PrimaryButton>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

ResetPassword.layout = {
    title: 'Atur Ulang Kata Sandi',
    description: 'Silakan masukkan kata sandi baru Anda di bawah ini',
};
