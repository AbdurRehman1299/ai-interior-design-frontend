'use client';

import { useState } from 'react';
import { Upload, Wand2, ArrowRight } from 'lucide-react';
import NavigationBar from "@/components/NavigationBar";

function Text_to_Image() {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [prompt, setPrompt] = useState("");
    const [resultImage, setResultImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const BACKEND_URL = "https://abdurrehman1288-interior-design.hf.space";

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleGenerate = async () => {
        if (!selectedImage || !prompt) return;

        setLoading(true);
        setResultImage(null);

        const formData = new FormData();
        formData.append('image', selectedImage);
        // We append keywords to ensure high quality results
        formData.append('prompt', prompt + ", best quality, photorealistic, 8k, interior design, high detail");

        try {
            const res = await fetch(`${BACKEND_URL}/api/redesign-room`, {
                method: 'POST',
                body: formData
            });

            const data = await res.json();

            if (data.generated_image) {
                setResultImage(data.generated_image);
            } else if (data.error) {
                alert(`Error from server: ${data.error}`);
            }
        } catch (error) {
            console.error("Failed to text-to-image:", error);
            alert("Failed to connect to the backend. Check your URL.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <NavigationBar />
            <section className="min-h-screen bg-gray-50 p-8 mt-15">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                        AI Room <span className="text-green-600">Text-to-Image</span>
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* INPUT SECTION */}
                        <section className="bg-white p-6 rounded-xl shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">1. Upload Your Room</h2>

                            <div className="mb-6">
                                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 overflow-hidden">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Original" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-10 h-10 mb-3 text-gray-400" />
                                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                                        </div>
                                    )}
                                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                                </label>
                            </div>

                            <h2 className="text-xl font-semibold mb-4">2. Describe the New Style</h2>
                            <textarea
                                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-green-500 outline-none"
                                rows="3"
                                placeholder="E.g., A minimalist living room with japanese influence, wooden furniture, warm lighting..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                            />

                            <button
                                onClick={handleGenerate}
                                disabled={loading || !selectedImage || !prompt}
                                className="w-full py-4 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Wand2 className="animate-spin" /> Generative Magic in Progress...
                                    </>
                                ) : (
                                    <>
                                        <Wand2 /> Redesign Room
                                    </>
                                )}
                            </button>
                        </section>

                        {/* OUTPUT SECTION */}
                        <section className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center justify-center min-h-[500px]">
                            <h2 className="text-xl font-semibold mb-4 self-start">3. Your New Room</h2>

                            {resultImage ? (
                                <div className="relative w-full h-full animate-in fade-in duration-700">
                                    <img
                                        src={resultImage}
                                        alt="AI Redesign"
                                        className="w-full h-auto rounded-lg shadow-lg"
                                    />
                                    <a
                                        href={resultImage}
                                        download="redesigned-room.png"
                                        className="mt-4 inline-block text-green-600 hover:underline"
                                    >
                                        Download Image
                                    </a>
                                </div>
                            ) : (
                                <div className="text-center text-gray-400">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                        <ArrowRight className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <p>Upload an image and generate to see the results here.</p>
                                </div>
                            )}
                        </section>

                    </div>
                </div>
            </section>
        </div>
    );
}

export default Text_to_Image;