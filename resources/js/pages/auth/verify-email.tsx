import { Form, Head, Link } from '@inertiajs/react';
import PrimaryButton from '@/components/PrimaryButton';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <>
            <Head title="Verifikasi Email" />

            {status === 'verification-link-sent' && (
                <div className="flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs leading-relaxed font-semibold text-emerald-700 mb-4 animate-fade-in">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    Tautan verifikasi baru telah dikirim ke alamat email yang Anda daftarkan.
                </div>
            )}

            <Form {...send.form()} className="space-y-6">
                {({ processing }) => (
                    <div className="space-y-4">
                        <PrimaryButton
                            type="submit"
                            className="flex w-full justify-center text-center text-xs font-black tracking-widest uppercase"
                            disabled={processing}
                        >
                            {processing ? 'Mengirim Ulang...' : 'Kirim Ulang Email Verifikasi'}
                        </PrimaryButton>

                        <div className="flex justify-center pt-2">
                            <Link
                                href={logout()}
                                method="post"
                                as="button"
                                className="cursor-pointer text-xs font-bold text-slate-500 hover:text-amber-500 transition duration-150"
                            >
                                Keluar Aplikasi
                            </Link>
                        </div>
                    </div>
                )}
            </Form>
        </>
    );
}

VerifyEmail.layout = {
    title: 'Verifikasi Email',
    description: 'Silakan verifikasi alamat email Anda dengan mengklik tautan yang baru saja kami kirimkan ke email Anda.',
};
