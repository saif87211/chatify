export default function GroupProfileModalSkeletion(params) {
    const skeletonContacts = Array(4).fill(null);
    return (
        <div className="flex flex-col transition-all duration-200">
            <div className="skeleton h-7 w-32 m-auto" />
            <div className="flex items-center justify-center gap-4">
                <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
                <div className="skeleton h-14 my-5 w-full"></div>
            </div>
            {/* Skeleton Contacts */}
            <div className="overflow-y-auto w-full py-3">
                {skeletonContacts.map((_, id) => (
                    <div key={id} className="w-full p-3 flex items-center gap-3">
                        {/* Avatar skeleton */}
                        <div className="relative mx-auto lg:mx-0">
                            <div className="skeleton size-12 rounded-full" />
                        </div>
                        {/* User info skeleton - only visible on larger screens */}
                        <div className="lg:block text-left min-w-0 flex-1">
                            <div className="skeleton h-4 w-32 mb-2" />
                            <div className="skeleton h-3 w-16" />
                        </div>
                    </div>
                ))}
            </div>
        </div>);
}