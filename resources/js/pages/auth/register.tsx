import { Form, Head, Link } from '@inertiajs/react';
import { ScanEye } from 'lucide-react';
import GuestLayout from '../../layouts/GuestLayout';
import InputLabel from '../../components/InputLabel';
import TextInput from '../../components/TextInput';
import InputError from '../../components/InputError';
import PrimaryButton from '../../components/PrimaryButton';
import { login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    // Real Google OAuth Redirect
    const handleGoogleRegister = () => {
        window.location.href = '/auth/google';
    };

    return (
        <GuestLayout minimal={true}>
            <Head title="Daftar Akun Baru" />

            <div className="flex min-h-[90vh] flex-col items-center justify-center bg-[#FCFCFC] dark:bg-neutral-950 px-4 py-12 sm:px-6 lg:px-8">
                <div className="relative w-full max-w-md space-y-6 sm:space-y-8 overflow-hidden rounded-3xl sm:rounded-[2.5rem] border border-slate-100 dark:border-neutral-900 bg-white dark:bg-neutral-900 p-5 sm:p-10 shadow-xl dark:shadow-neutral-950/40 transition-all">
                    {/* Visual decoration */}
                    <div className="pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full bg-yellow-100 dark:bg-yellow-950/20 opacity-50 blur-2xl"></div>

                    {/* Logo & Header */}
                    <div className="space-y-2 text-center">
                        <Link
                            href="/"
                            className="group inline-flex cursor-pointer justify-center transition hover:scale-105"
                        >
                            <div className="rounded-2xl bg-yellow-500 p-2.5 shadow-lg shadow-yellow-500/30">
                                <ScanEye className="h-6 w-6 text-white" />
                            </div>
                        </Link>
                        <h2 className="pt-3 text-2xl font-black tracking-tight text-slate-800 dark:text-white uppercase italic">
                            Daftar <span className="text-yellow-500">SmartBanana</span>
                        </h2>
                        <p className="text-xs font-semibold text-slate-500 dark:text-neutral-450">
                            Mulai perjalanan analisis kematangan pisang Anda bersama kami
                        </p>
                    </div>

                    <Form
                        {...store.form()}
                        resetOnSuccess={['password', 'password_confirmation']}
                        className="space-y-5"
                    >
                        {({ processing, errors }) => (
                            <>
                                {/* Nama Lengkap Input wrapper */}
                                <div className="space-y-2">
                                    <InputLabel htmlFor="name" value="Nama Lengkap" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        name="name"
                                        placeholder="Nama Lengkap Anda"
                                        className="block w-full focus:border-yellow-500 focus:ring-yellow-500"
                                        autoComplete="name"
                                        isFocused={true}
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                {/* Email Input wrapper */}
                                <div className="space-y-2">
                                    <InputLabel htmlFor="email" value="Email" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="nama@email.com"
                                        className="block w-full focus:border-yellow-500 focus:ring-yellow-500"
                                        autoComplete="email"
                                        required
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                {/* Password Input wrapper */}
                                <div className="space-y-2">
                                    <InputLabel
                                        htmlFor="password"
                                        value="Kata Sandi Baru"
                                    />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder="Min. 8 karakter"
                                        className="block w-full focus:border-yellow-500 focus:ring-yellow-500"
                                        autoComplete="new-password"
                                        required
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                {/* Confirm Password Input wrapper */}
                                <div className="space-y-2">
                                    <InputLabel
                                        htmlFor="password_confirmation"
                                        value="Konfirmasi Kata Sandi"
                                    />
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        placeholder="Ulangi kata sandi di atas"
                                        className="block w-full focus:border-yellow-500 focus:ring-yellow-500"
                                        autoComplete="new-password"
                                        required
                                    />
                                    <InputError
                                        message={errors.password_confirmation}
                                    />
                                </div>

                                {/* Action buttons */}
                                <div className="space-y-3 pt-2">
                                    <PrimaryButton
                                        className="flex w-full justify-center text-center text-xs font-black tracking-widest uppercase"
                                        disabled={processing}
                                    >
                                        {processing
                                            ? 'Mendaftarkan Akun...'
                                            : 'Daftar sekarang'}
                                    </PrimaryButton>

                                    <div className="relative flex items-center py-2">
                                        <div className="flex-grow border-t border-slate-100 dark:border-neutral-800"></div>
                                        <span className="mx-4 flex-shrink text-[9px] font-black tracking-wider text-slate-400 dark:text-neutral-500 uppercase">
                                            atau daftar melalui
                                        </span>
                                        <div className="flex-grow border-t border-slate-100 dark:border-neutral-800"></div>
                                    </div>

                                    {/* Google Sign Up Option */}
                                    <button
                                        type="button"
                                        onClick={handleGoogleRegister}
                                        className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-6 py-3.5 text-xs font-black tracking-wider text-slate-700 dark:text-neutral-350 shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-neutral-900 active:scale-95"
                                    >
                                        <svg
                                            className="h-4 w-4"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                        >
                                            <path
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                fill="#4285F4"
                                            />
                                            <path
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                fill="#34A853"
                                            />
                                            <path
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                                fill="#FBBC05"
                                            />
                                            <path
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                                fill="#EA4335"
                                            />
                                        </svg>
                                        Daftar dengan Google
                                    </button>
                                </div>
                            </>
                        )}
                    </Form>

                    {/* Redirect link */}
                    <div className="flex justify-center border-t border-slate-100 dark:border-neutral-800 pt-6 text-xs">
                        <span className="font-semibold text-slate-500 dark:text-neutral-400">
                            Sudah memiliki akun?
                        </span>
                        <Link
                            href={login()}
                            className="ml-1.5 font-bold text-yellow-500 transition hover:text-yellow-600"
                        >
                            Masuk Sekarang
                        </Link>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
