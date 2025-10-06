
import React from 'react';
import { useResume } from '../hooks/useResume';
import { useNavigate, Link } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon } from '../components/icons';

const Dashboard: React.FC = () => {
    const { resumes, addResume, deleteResume } = useResume();
    const navigate = useNavigate();

    const handleCreateNew = () => {
        const newId = addResume();
        navigate(`/resume/${newId}`);
    };

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            deleteResume(id);
        }
    };
    
    return (
        <>
            <header className="bg-primary shadow-md p-4 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white tracking-wider">
                    Career <span className="text-secondary">Pulse</span>
                </h1>
                <button 
                    onClick={handleCreateNew}
                    className="flex items-center gap-2 bg-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
                >
                    <PlusIcon className="w-5 h-5"/>
                    New Resume
                </button>
            </header>
            <main className="p-4 md:p-8">
                <h2 className="text-2xl font-bold text-text-primary mb-6">My Resumes</h2>
                {resumes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {resumes.map(resume => (
                            <div key={resume.id} className="bg-white rounded-lg shadow-lg p-5 flex flex-col justify-between hover:shadow-xl transition-shadow">
                                <div>
                                    <h3 className="text-xl font-bold text-primary truncate">{resume.name}</h3>
                                    <p className="text-text-secondary mt-1">{resume.personalInfo.name || 'No Name'}</p>
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                     <Link to={`/resume/${resume.id}`} className="p-2 text-gray-600 hover:text-primary hover:bg-primary/10 rounded-full transition-colors" title="Edit">
                                        <PencilIcon className="w-5 h-5" />
                                    </Link>
                                    <button onClick={() => handleDelete(resume.id, resume.name)} className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors" title="Delete">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 px-6 bg-white rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold text-text-primary">No resumes yet!</h3>
                        <p className="text-text-secondary mt-2 mb-6">Click the "New Resume" button to get started and build your career profile.</p>
                        <button 
                            onClick={handleCreateNew}
                            className="flex items-center gap-2 mx-auto bg-secondary text-white font-bold py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            <PlusIcon className="w-5 h-5"/>
                            Create Your First Resume
                        </button>
                    </div>
                )}
            </main>
        </>
    );
};

export default Dashboard;
