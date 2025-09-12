import React from 'react';

const AuthModal = ({ isOpen, onClose, mode, onSwitchMode }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
                <h2 className="text-2xl font-bold mb-4">
                    {mode === 'login' ? 'Login' : 'Sign Up'}
                </h2>
                <p>Auth modal will be implemented here</p>
                <button
                    onClick={onClose}
                    className="mt-4 btn btn-outline w-full"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default AuthModal;