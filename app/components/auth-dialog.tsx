"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export function AuthDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="night"
          size="sm"
          className="border-yellow-500/20 hover:border-yellow-500/40 text-yellow-500"
        >
          Join the night
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0B0E17] border-slate-800/50 sm:max-w-[400px] p-0">
        <SignIn
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: "#EAB308",
              colorBackground: "#0B0E17",
              colorInputBackground: "#1E293B",
              colorInputText: "#fff",
              colorTextOnPrimaryBackground: "#0B0E17",
            },
            elements: {
              rootBox: "w-full",
              card: "bg-transparent shadow-none p-4",
              headerTitle: "text-white text-xl",
              headerSubtitle: "text-slate-400",
              dividerLine: "bg-slate-800/50",
              dividerText: "text-slate-500",
              formButtonPrimary:
                "bg-yellow-500 hover:bg-yellow-600 text-slate-900",
              socialButtonsIconButton:
                "bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50",
              formFieldInput: "bg-slate-800/50 border-slate-700/50",
              footer: "hidden",
            },
          }}
          routing="virtual"
        />
      </DialogContent>
    </Dialog>
  );
}
