import React from 'react';

const StatsCard = ({ title, value, icon: Icon, change, changeType = 'neutral', color = 'purple' }) => {
    const colorClasses = {
        purple: 'from-purple-500 to-purple-600',
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-green-600',
        orange: 'from-orange-500 to-orange-600',
        red: 'from-red-500 to-red-600',
    };

    const changeColors = {
        positive: 'text-green-600',
        negative: 'text-red-600',
        neutral: 'text-gray-600',
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                    {change !== undefined && (
                        <p className={`text-sm mt-2 ${changeColors[changeType]}`}>
                            {changeType === 'positive' ? '↗' : changeType === 'negative' ? '↘' : '→'} {change}
                        </p>
                    )}
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );
};

export default StatsCard;