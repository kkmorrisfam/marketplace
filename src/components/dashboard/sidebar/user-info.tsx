import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User } from '@/generated/prisma/client';

export default function UserInfo({ user }:{user:User | null}) {
    // check to see if there's a user value first
    if (!user) {
        return null;
    }

    //create standard name variable
    const name = 
        user.displayName ||
        `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
        user.username ||
        user.email;


    // create standard initials
    const initials =
        `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}` ||
  
  user.email[0].toUpperCase();
    const role = user.role;

    return (
    <div>
        <div>
            <Button className='w-full mt-5 mb-4 flex items-center justify-between py-10 ' variant="ghost" >
                <div className="flex items-center text-left gap-2">
                    <Avatar className='w-16 h-16'>
                        <AvatarImage 
                            src={user?.imageUrl ?? undefined} 
                            
                            alt={name}/> {/**tutorial  had alt={`${user?.firstname!}  ${user?.lastName!}`}     */} 
                        <AvatarFallback className='bg-primary text-white'>
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-y-1">
                        {name}
                        <span className='text-muted-foreground'>
                            {user?.email}
                        </span>
                        <span className='w-fit'>
                            <Badge variant="secondary" className='capitalize' >
                                {role.toLocaleLowerCase()}
                            </Badge>
                        </span>
                    </div>
                </div>
            </Button>
        </div>
    </div>
  )
}
