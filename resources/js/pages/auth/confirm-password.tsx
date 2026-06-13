import { Form, Head } from '@inertiajs/react';
import InputLabel from '@/components/InputLabel';
import TextInput from '@/components/TextInput';
import InputError from '@/components/InputError';
import PrimaryButton from '@/components/PrimaryButton';
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    return (
        <>
            <Head title="Konfirmasi Kata Sandi" />

            <Form {...store.form()} resetOnSuccess={['password']} className="space-y-6">
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-2">
                            <InputLabel htmlFor="password" value="Kata Sandi" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Masukkan kata sandi Anda"
                                autoComplete="current-password"
                                className="block w-full focus:border-amber-500 focus:ring-amber-500"
                                isFocused={true}
                                required
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="pt-2">
                            <PrimaryButton
                                type="submit"
                                className="flex w-full justify-center text-center text-xs font-black tracking-widest uppercase"
                                disabled={processing}
                            >
                                {processing ? 'Mengonfirmasi...' : 'Konfirmasi Sandi'}
                            </PrimaryButton>
                        </div>
                    </>
                )}
            </Form>
        </>
    );
}

ConfirmPassword.layout = {
    title: 'Konfirmasi Sandi',
    description: 'Ini adalah area aplikasi yang aman. Silakan konfirmasikan kata sandi Anda sebelum melanjutkan.',
};
