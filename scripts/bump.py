import toml
import sys

def parse_args():
    import argparse
    parser = argparse.ArgumentParser(description='Bump the version in Cargo.toml')
    parser.add_argument('--version', required=True, help='Version to set')
    return parser.parse_args()

def main():
    args = parse_args()
    f = 'src-tauri/Cargo.toml'
    data = toml.load(f)
    data['package']['version'] = args.version
    with open(f, 'w') as out:
        toml.dump(data, out)

if __name__ == '__main__':
    main()