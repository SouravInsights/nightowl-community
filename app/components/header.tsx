"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Moon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import NewTrace from "./traces/new-trace";
import { AuthDialog } from "./auth-dialog";

export function Header() {
  const { isSignedIn } = useUser();

  return (
    <header className="fixed top-0 w-full bg-slate-950/80 backdrop-blur-sm border-b border-slate-800 z-50">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Moon className="w-5 h-5 text-yellow-400" />
          <span className="font-mono font-bold text-white">
            nightowl.community
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isSignedIn ? (
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="night" size="sm">
                    <Plus className="w-4 h-4 " />
                    <span className="hidden sm:block">New Trace</span>
                    <span className="block sm:hidden">New</span>
                  </Button>
                </DialogTrigger>
                <NewTrace />
              </Dialog>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8",
                  },
                }}
              />
            </>
          ) : (
            <AuthDialog />
          )}
        </div>
      </div>
    </header>
  );
}
