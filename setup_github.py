#!/usr/bin/env python3
"""
Setup GitHub Integration
Helper script to diagnose and setup GitHub connection.
"""

import subprocess
import sys
import shutil

def check_command(cmd):
    """Check if a command exists in PATH"""
    return shutil.which(cmd) is not None

def run_command(cmd, check=True):
    """Run a shell command"""
    try:
        result = subprocess.run(cmd, shell=True, check=check, capture_output=True, text=True)
        return True, result.stdout.strip()
    except subprocess.CalledProcessError as e:
        return False, e.stderr.strip()

def main():
    print("🔧 Setting up GitHub Connection...\n")

    # 1. Check Git
    if not check_command("git"):
        print("❌ Git is not installed.")
        return
    print("✅ Git is installed.")

    # 2. Check Repo
    success, _ = run_command("git rev-parse --is-inside-work-tree")
    if not success:
        print("❌ Not a git repository. Run 'git init' first.")
        return
    print("✅ Inside a git repository.")

    # 3. Check Remote
    success, output = run_command("git remote -v")
    if "origin" not in output:
        print("⚠️  No 'origin' remote found.")
        print("   Run: git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git")
    else:
        print("✅ Remote 'origin' configured:")
        for line in output.splitlines():
            print(f"   {line}")

    # 4. Check GitHub CLI (gh)
    if check_command("gh"):
        print("\nChecking GitHub CLI status...")
        success, output = run_command("gh auth status")
        if success:
            print("✅ GitHub CLI is authenticated.")
            print(output)
        else:
            print("⚠️  GitHub CLI not logged in.")
            print("   Run: gh auth login")
            print("   Error details:", output)
    else:
        print("\n⚠️  GitHub CLI (gh) not found. Recommended for easier management.")

    print("\n✅ Setup check complete.")

if __name__ == "__main__":
    main()
