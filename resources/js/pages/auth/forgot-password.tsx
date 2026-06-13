import { Form, Head, Link } from '@inertiajs/react';
import InputLabel from '@/components/InputLabel';
import TextInput from '@/components/TextInput';
import InputError from '@/components/InputError';
import PrimaryButton from '@/components/PrimaryButton';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Lupa Kata Sandi" />

            {status && (
                <div className="flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs leading-relaxed font-semibold text-emerald-700 mb-4 animate-fade-in">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    {status}
                </div>
            )}

            <Form {...email.form()} className="space-y-6">
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-2">
                            <InputLabel htmlFor="email" value="Alamat Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="off"
                                isFocused={true}
                                required
                                placeholder="nama@email.com"
                                className="block w-full focus:border-amber-500 focus:ring-amber-500"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="pt-2">
                            <PrimaryButton
                                className="flex w-full justify-center text-center text-xs font-black tracking-widest uppercase"
                                disabled={processing}
                            >
                                {processing ? 'Mengirim Tautan...' : 'Kirim Tautan Reset Sandi'}
                            </PrimaryButton>
                        </div>
                    </>
                )}
            </Form>

            <div className="flex justify-center border-t border-slate-100 dark:border-neutral-800 pt-6 text-xs">
                <span className="font-semibold text-slate-500 dark:text-neutral-400">
                    Kembali ke halaman
                </span>
                <Link
                    href={login()}
                    className="ml-1.5 font-bold text-amber-500 transition hover:text-amber-600"
                >
                    Masuk Sekarang
                </Link>
            </div>
        </>
    );
}

ForgotPassword.layout = {
    title: 'Lupa Kata Sandi',
    description: 'Masukkan alamat email Anda untuk menerima tautan atur ulang kata sandi',
};
