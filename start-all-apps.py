#!/usr/bin/env python3
"""
Marsh MRS Suite - Start All Apps Locally
Opens all 9 apps on different ports and launches them in the browser
"""

import subprocess
import time
import webbrowser
import os
import signal
import sys
from pathlib import Path

# Define all apps with their ports
APPS = {
    "01-intake-analyzer": 8000,
    "02-mrs-dashboard": 8001,
    "03-gap-analyzer": 8002,
    "04-risk-heatmap": 8003,
    "05-capacity-planner": 8004,
    "06-contract-monitor": 8005,
    "07-steering-dashboard": 8006,
    "08-evidence-pack-generator": 8007,
    "09-power-automate-bridge": 8008,
}

def start_apps():
    """Start all web servers and open in browser"""
    
    repo_root = Path("marsh-mrs-suite-govcloud-assessment") if Path("marsh-mrs-suite-govcloud-assessment").exists() else Path.cwd()
    apps_folder = repo_root / "apps"
    
    if not apps_folder.exists():
        print(f"❌ Error: Could not find apps folder at {apps_folder}")
        sys.exit(1)
    
    print("\n" + "="*60)
    print("🚀 Starting all Marsh MRS Suite apps...")
    print("="*60 + "\n")
    
    processes = []
    
    # Start each app server
    for app_name, port in APPS.items():
        app_path = apps_folder / app_name
        
        if not app_path.exists():
            print(f"⚠️  Skipped: {app_name} (folder not found)")
            continue
        
        try:
            # Start HTTP server in app folder
            process = subprocess.Popen(
                [sys.executable, "-m", "http.server", str(port)],
                cwd=str(app_path),
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            processes.append(process)
            print(f"✅ Started: {app_name} on http://localhost:{port}/")
            
        except Exception as e:
            print(f"❌ Error starting {app_name}: {e}")
            continue
    
    print("\n" + "="*60)
    print(f"✅ All {len(processes)} apps running!")
    print("="*60 + "\n")
    
    # Wait a moment then open browsers
    time.sleep(2)
    
    print("📂 Opening apps in browser...\n")
    
    for app_name, port in APPS.items():
        url = f"http://localhost:{port}/"
        try:
            webbrowser.open(url)
            print(f"🌐 Opened: {app_name}")
            time.sleep(0.5)  # Small delay between opening tabs
        except Exception as e:
            print(f"⚠️  Could not open browser for {app_name}: {e}")
    
    print("\n" + "="*60)
    print("✅ All apps are running and open in your browser!")
    print("="*60)
    print("\nOpen these URLs manually if tabs didn't open:")
    print()
    for app_name, port in APPS.items():
        print(f"  http://localhost:{port}/  ({app_name})")
    
    print("\n" + "="*60)
    print("Press Ctrl+C to stop all servers")
    print("="*60 + "\n")
    
    # Keep running until Ctrl+C
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n\n⏹️  Stopping all servers...")
        for process in processes:
            try:
                process.terminate()
            except:
                pass
        print("✅ All servers stopped.")
        sys.exit(0)

if __name__ == "__main__":
    start_apps()
